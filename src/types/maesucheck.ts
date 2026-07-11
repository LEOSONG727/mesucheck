export type ConfidenceLabel =
  | "rule_based"
  | "variable"
  | "needs_expert_check"
  | "concept_only";

export type TriState = "yes" | "no" | "unknown";

export type Complex = {
  id: string;
  name: string;
  sido: string;
  sigungu: string;
  dong: string;
  lawdCd: string;
  address: string;
  builtYear: number;
  householdCount: number;
  defaultAreaM2: number;
  recentDealKRW: number;
  recentDealDate: string;
  pyeongPriceKRW: number;
  sixMonthChangePercent: number;
  sixMonthTradeCount: number;
  jeonseRatioPercent: number;
  basisDate: string;
  verificationStatus: "needs_review" | "verified";
  zoneLabels: string[];
  externalLinks: ExternalLinks;
  trend: TrendPoint[];
  marketSnapshot?: import("@/types/public-data").ComplexMarketSnapshot;
};

export type TrendPoint = {
  month: string;
  pyeongPriceKRW: number;
  tradeCount: number;
};

export type ExternalLinks = {
  naverLand?: string;
  hogangnono?: string;
  zigbang?: string;
};

export type BuyerConditions = {
  complexId: string;
  priceKRW: number;
  areaM2: number;
  homeCountAfterPurchase: number | "unknown";
  isActualResidence: boolean | "unknown";
  isFirstHomeBuyer: boolean | "unknown";
  willUseLoan: boolean | "unknown";
  isTemporaryTwoHome: TriState;
  willDisposeExistingHome: TriState;
};

export type CostItem = {
  key: string;
  label: string;
  amountKRW?: number;
  minAmountKRW?: number;
  maxAmountKRW?: number;
  confidenceLabel: ConfidenceLabel;
  basis: string;
  explanation: string;
  lawRefId?: string;
  lawRefTitle?: string;
  sourceUrl?: string;
  basisDate: string;
  isIncludedInTotal: boolean;
};

export type RiskBadgeItem = {
  label: string;
  confidenceLabel: ConfidenceLabel;
  description: string;
};

export type CheckCard = {
  title: string;
  body: string;
  confidenceLabel: ConfidenceLabel;
};

export type CostEstimateReport = {
  id: string;
  summary: {
    complexName: string;
    purchasePriceKRW: number;
    estimatedAdditionalCostKRW: number;
    estimatedTotalAcquisitionCostKRW: number;
    basisDate: string;
  };
  input: BuyerConditions;
  conditionSummary: string[];
  costItems: CostItem[];
  riskBadges: RiskBadgeItem[];
  exemptionChecks: CheckCard[];
  loanNotes: CheckCard[];
  conceptNotes: CheckCard[];
  expertCheckQuestions: string[];
  externalLinks: ExternalLinks;
  disclaimer: string;
};

export type RuleVerificationStatus = "needs_review" | "verified";

export type AcquisitionTaxCalculationType =
  | "flat_rate"
  | "linear_rate"
  | "expert_check";

export type AcquisitionTaxRule = {
  id: string;
  homeCountMin: number;
  homeCountMax?: number;
  zoneType: "common" | "regulated" | "any";
  priceMinKRW?: number;
  priceMaxKRW?: number;
  areaThresholdM2?: number;
  calculationType: AcquisitionTaxCalculationType;
  acquisitionTaxRate?: number;
  formulaKey?: "price_linear_rate";
  formulaParams?: Record<string, number>;
  localEducationTaxRate?: number;
  specialRuralTaxRate?: number;
  label: string;
  description: string;
  lawRefId?: string;
  effectiveFrom: string;
  effectiveTo?: string;
  basisDate: string;
  verificationStatus: RuleVerificationStatus;
};

export type IncidentalFeeRule = {
  id: string;
  feeKey: string;
  label: string;
  calculationType: "fixed" | "rate" | "range" | "manual_note";
  priceMinKRW?: number;
  priceMaxKRW?: number;
  rate?: number;
  capAmountKRW?: number;
  fixedAmountKRW?: number;
  minAmountKRW?: number;
  maxAmountKRW?: number;
  confidenceLabel: ConfidenceLabel;
  description: string;
  lawRefId?: string;
  effectiveFrom: string;
  effectiveTo?: string;
  basisDate: string;
  verificationStatus: RuleVerificationStatus;
};

export type LawReference = {
  id: string;
  title: string;
  sourceUrl?: string;
  basisDate: string;
  verificationStatus: RuleVerificationStatus;
};

export type ConceptNoteRule = {
  key: string;
  title: string;
  summary: string;
  body?: string;
  confidenceLabel: ConfidenceLabel;
  basisDate: string;
  verificationStatus: RuleVerificationStatus;
};

export type CostRuleSet = {
  acquisitionTaxRules: AcquisitionTaxRule[];
  incidentalFeeRules: IncidentalFeeRule[];
  lawReferences: LawReference[];
  conceptNotes: ConceptNoteRule[];
  zoneType: "common" | "regulated";
  zoneLabels: string[];
  basisDate: string;
  source: "supabase" | "seed_fallback";
};

export type CostEstimateRequest = BuyerConditions;

export type WatchlistItem = {
  complexId: string;
  complexName: string;
  dong: string;
  savedAt: string;
  recentDealKRW: number;
  estimatedAdditionalCostKRW?: number;
  riskLabels: string[];
};
