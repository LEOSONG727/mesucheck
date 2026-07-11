import {
  RULE_BASIS_DATE,
  seedAcquisitionTaxRules,
  seedConceptNotes,
  seedIncidentalFeeRules,
  seedLawReferences,
} from "@/data/rule-seed";
import { shouldUseSupabaseDataSource } from "@/lib/repositories/data-source";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type {
  AcquisitionTaxCalculationType,
  AcquisitionTaxRule,
  ConceptNoteRule,
  ConfidenceLabel,
  CostRuleSet,
  IncidentalFeeRule,
  LawReference,
  RuleVerificationStatus,
} from "@/types/maesucheck";

type AcquisitionTaxRow = {
  id: string;
  home_count_min: number;
  home_count_max: number | null;
  zone_type: string;
  price_min_krw: number | string | null;
  price_max_krw: number | string | null;
  area_threshold_m2: number | string | null;
  calculation_type: string | null;
  acquisition_tax_rate: number | string | null;
  formula_key: string | null;
  formula_params: Record<string, number> | null;
  local_education_tax_rate: number | string | null;
  special_rural_tax_rate: number | string | null;
  label: string;
  description: string | null;
  law_ref_id: string | null;
  effective_from: string;
  effective_to: string | null;
  basis_date: string;
  verification_status: string;
};

type IncidentalFeeRow = {
  id: string;
  fee_key: string;
  label: string;
  calculation_type: string;
  price_min_krw: number | string | null;
  price_max_krw: number | string | null;
  rate: number | string | null;
  cap_amount_krw: number | string | null;
  fixed_amount_krw: number | string | null;
  min_amount_krw: number | string | null;
  max_amount_krw: number | string | null;
  confidence_label: string;
  description: string | null;
  law_ref_id: string | null;
  effective_from: string;
  effective_to: string | null;
  basis_date: string;
  verification_status: string;
};

type LawReferenceRow = {
  id: string;
  title: string | null;
  law_name: string;
  article: string | null;
  source_url: string | null;
  basis_date: string;
  verification_status: string;
};

type ConceptNoteRow = {
  note_key: string;
  title: string;
  summary: string;
  body: string | null;
  confidence_label: string;
  basis_date: string;
  verification_status: string;
};

type ZoneRow = {
  zone_type: string;
  basis_date: string;
};

export async function getCostRuleSet(lawdCd: string): Promise<CostRuleSet> {
  if (!shouldUseSupabaseDataSource()) {
    return buildSeedRuleSet();
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return buildSeedRuleSet();
  }

  const today = new Date().toISOString().slice(0, 10);
  const [taxResult, feeResult, lawResult, conceptResult, zoneResult] = await Promise.all([
    supabase
      .from("acquisition_tax_rules")
      .select(
        "id,home_count_min,home_count_max,zone_type,price_min_krw,price_max_krw,area_threshold_m2,calculation_type,acquisition_tax_rate,formula_key,formula_params,local_education_tax_rate,special_rural_tax_rate,label,description,law_ref_id,effective_from,effective_to,basis_date,verification_status",
      )
      .lte("effective_from", today)
      .or(`effective_to.is.null,effective_to.gte.${today}`),
    supabase
      .from("incidental_fees")
      .select(
        "id,fee_key,label,calculation_type,price_min_krw,price_max_krw,rate,cap_amount_krw,fixed_amount_krw,min_amount_krw,max_amount_krw,confidence_label,description,law_ref_id,effective_from,effective_to,basis_date,verification_status",
      )
      .lte("effective_from", today)
      .or(`effective_to.is.null,effective_to.gte.${today}`),
    supabase
      .from("law_refs")
      .select("id,title,law_name,article,source_url,basis_date,verification_status"),
    supabase
      .from("concept_notes")
      .select("note_key,title,summary,body,confidence_label,basis_date,verification_status"),
    supabase
      .from("regulated_zones")
      .select("zone_type,basis_date")
      .eq("lawd_cd", lawdCd)
      .eq("is_active", true)
      .lte("effective_from", today)
      .or(`effective_to.is.null,effective_to.gte.${today}`),
  ]);

  const hasError = [taxResult, feeResult, lawResult, conceptResult, zoneResult].some(
    (result) => result.error,
  );
  if (hasError || !taxResult.data?.length || !feeResult.data?.length) {
    return buildSeedRuleSet();
  }

  const zones = (zoneResult.data ?? []) as ZoneRow[];
  const basisDates = [
    ...(taxResult.data as AcquisitionTaxRow[]).map((row) => row.basis_date),
    ...(feeResult.data as IncidentalFeeRow[]).map((row) => row.basis_date),
    ...zones.map((row) => row.basis_date),
  ];

  return {
    acquisitionTaxRules: (taxResult.data as AcquisitionTaxRow[]).map(mapTaxRule),
    incidentalFeeRules: (feeResult.data as IncidentalFeeRow[]).map(mapFeeRule),
    lawReferences: ((lawResult.data ?? []) as LawReferenceRow[]).map(mapLawReference),
    conceptNotes: ((conceptResult.data ?? []) as ConceptNoteRow[]).map(mapConceptNote),
    zoneType: zones.length > 0 ? "regulated" : "common",
    zoneLabels: zones.map((row) => row.zone_type),
    basisDate: latestDate(basisDates, RULE_BASIS_DATE),
    source: "supabase",
  };
}

function buildSeedRuleSet(): CostRuleSet {
  return {
    acquisitionTaxRules: seedAcquisitionTaxRules,
    incidentalFeeRules: seedIncidentalFeeRules,
    lawReferences: seedLawReferences,
    conceptNotes: seedConceptNotes,
    zoneType: "regulated",
    zoneLabels: ["조정대상지역", "투기과열지구"],
    basisDate: RULE_BASIS_DATE,
    source: "seed_fallback",
  };
}

function mapTaxRule(row: AcquisitionTaxRow): AcquisitionTaxRule {
  return {
    id: row.id,
    homeCountMin: row.home_count_min,
    homeCountMax: nullableNumber(row.home_count_max),
    zoneType: normalizeZoneType(row.zone_type),
    priceMinKRW: nullableNumber(row.price_min_krw),
    priceMaxKRW: nullableNumber(row.price_max_krw),
    areaThresholdM2: nullableNumber(row.area_threshold_m2),
    calculationType: normalizeCalculationType(row.calculation_type),
    acquisitionTaxRate: nullableNumber(row.acquisition_tax_rate),
    formulaKey: row.formula_key === "price_linear_rate" ? row.formula_key : undefined,
    formulaParams: row.formula_params ?? undefined,
    localEducationTaxRate: nullableNumber(row.local_education_tax_rate),
    specialRuralTaxRate: nullableNumber(row.special_rural_tax_rate),
    label: row.label,
    description: row.description ?? "규칙 테이블 기준 항목입니다.",
    lawRefId: row.law_ref_id ?? undefined,
    effectiveFrom: row.effective_from,
    effectiveTo: row.effective_to ?? undefined,
    basisDate: row.basis_date,
    verificationStatus: normalizeVerification(row.verification_status),
  };
}

function mapFeeRule(row: IncidentalFeeRow): IncidentalFeeRule {
  const calculationType = ["fixed", "rate", "range", "manual_note"].includes(
    row.calculation_type,
  )
    ? (row.calculation_type as IncidentalFeeRule["calculationType"])
    : "manual_note";

  return {
    id: row.id,
    feeKey: row.fee_key,
    label: row.label,
    calculationType,
    priceMinKRW: nullableNumber(row.price_min_krw),
    priceMaxKRW: nullableNumber(row.price_max_krw),
    rate: nullableNumber(row.rate),
    capAmountKRW: nullableNumber(row.cap_amount_krw),
    fixedAmountKRW: nullableNumber(row.fixed_amount_krw),
    minAmountKRW: nullableNumber(row.min_amount_krw),
    maxAmountKRW: nullableNumber(row.max_amount_krw),
    confidenceLabel: normalizeConfidence(row.confidence_label),
    description: row.description ?? "실제 거래 조건에 따라 달라질 수 있습니다.",
    lawRefId: row.law_ref_id ?? undefined,
    effectiveFrom: row.effective_from,
    effectiveTo: row.effective_to ?? undefined,
    basisDate: row.basis_date,
    verificationStatus: normalizeVerification(row.verification_status),
  };
}

function mapLawReference(row: LawReferenceRow): LawReference {
  return {
    id: row.id,
    title: row.title ?? [row.law_name, row.article].filter(Boolean).join(" "),
    sourceUrl: row.source_url ?? undefined,
    basisDate: row.basis_date,
    verificationStatus: normalizeVerification(row.verification_status),
  };
}

function mapConceptNote(row: ConceptNoteRow): ConceptNoteRule {
  return {
    key: row.note_key,
    title: row.title,
    summary: row.summary,
    body: row.body ?? undefined,
    confidenceLabel: normalizeConfidence(row.confidence_label),
    basisDate: row.basis_date,
    verificationStatus: normalizeVerification(row.verification_status),
  };
}

function normalizeZoneType(value: string): AcquisitionTaxRule["zoneType"] {
  if (value === "regulated" || value === "any") {
    return value;
  }
  return "common";
}

function normalizeCalculationType(value: string | null): AcquisitionTaxCalculationType {
  if (value === "flat_rate" || value === "linear_rate" || value === "expert_check") {
    return value;
  }
  return "expert_check";
}

function normalizeVerification(value: string): RuleVerificationStatus {
  return value === "verified" ? "verified" : "needs_review";
}

function normalizeConfidence(value: string): ConfidenceLabel {
  if (
    value === "rule_based" ||
    value === "variable" ||
    value === "needs_expert_check" ||
    value === "concept_only"
  ) {
    return value;
  }
  return "needs_expert_check";
}

function nullableNumber(value: number | string | null): number | undefined {
  if (value === null) {
    return undefined;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function latestDate(values: string[], fallback: string): string {
  return values.filter(Boolean).sort().at(-1) ?? fallback;
}
