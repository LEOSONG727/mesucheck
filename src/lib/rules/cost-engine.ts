import type {
  AcquisitionTaxRule,
  BuyerConditions,
  CheckCard,
  Complex,
  CostEstimateReport,
  CostItem,
  CostRuleSet,
  IncidentalFeeRule,
  RiskBadgeItem,
} from "@/types/maesucheck";

export const COST_REPORT_DISCLAIMER =
  "입력 조건 기준의 참고 리포트입니다. 실제 세금과 규제 적용은 세부 조건, 법령 변경, 관할 기관 판단에 따라 달라질 수 있어요. 최종 계약 전에는 세무사·공인중개사·법무사와 함께 확인하는 것이 안전합니다.";

export function calculateCostEstimate(
  conditions: BuyerConditions,
  complex: Complex,
  rules: CostRuleSet,
): CostEstimateReport {
  const taxItems = buildTaxItems(conditions, rules);
  const feeItems = buildFeeItems(conditions.priceKRW, rules);
  const costItems = [...taxItems, ...feeItems];
  const estimatedAdditionalCostKRW = costItems.reduce((sum, item) => {
    if (!item.isIncludedInTotal) return sum;
    if (typeof item.amountKRW === "number") return sum + item.amountKRW;
    if (typeof item.minAmountKRW === "number" && typeof item.maxAmountKRW === "number") {
      return sum + Math.round((item.minAmountKRW + item.maxAmountKRW) / 2);
    }
    return sum;
  }, 0);

  return {
    id: "estimate-preview",
    summary: {
      complexName: complex.name,
      purchasePriceKRW: conditions.priceKRW,
      estimatedAdditionalCostKRW,
      estimatedTotalAcquisitionCostKRW: conditions.priceKRW + estimatedAdditionalCostKRW,
      basisDate: rules.basisDate,
    },
    input: conditions,
    conditionSummary: buildConditionSummary(conditions, complex),
    costItems,
    riskBadges: buildRiskBadges(conditions, rules),
    exemptionChecks: buildExemptionChecks(conditions),
    loanNotes: buildLoanNotes(conditions),
    conceptNotes: rules.conceptNotes.map((note) => ({
      title: note.title,
      body: [note.summary, note.body].filter(Boolean).join(" "),
      confidenceLabel: note.confidenceLabel,
    })),
    expertCheckQuestions: buildExpertQuestions(conditions, rules),
    externalLinks: complex.externalLinks,
    disclaimer: COST_REPORT_DISCLAIMER,
  };
}

function buildTaxItems(conditions: BuyerConditions, rules: CostRuleSet): CostItem[] {
  const baseRule = findBaseTaxRule(conditions, rules);
  if (!baseRule || conditions.homeCountAfterPurchase === "unknown") {
    return [expertTaxItem(rules.basisDate, "주택 수 또는 적용 규칙을 확정할 수 없어 취득세 금액을 계산하지 않았습니다.")];
  }
  const homeCount = conditions.homeCountAfterPurchase;
  if (baseRule.calculationType === "expert_check") {
    return [expertTaxItem(baseRule.basisDate, baseRule.description, baseRule)];
  }

  const acquisitionRate = calculateAcquisitionRate(baseRule, conditions.priceKRW);
  if (acquisitionRate === undefined) {
    return [expertTaxItem(baseRule.basisDate, "규칙 데이터의 산식이 완전하지 않아 금액을 계산하지 않았습니다.", baseRule)];
  }

  const acquisitionTax = roundKRW(conditions.priceKRW * acquisitionRate);
  const educationTax =
    baseRule.localEducationTaxRate === undefined
      ? undefined
      : roundKRW(conditions.priceKRW * baseRule.localEducationTaxRate);
  const ruralRule = rules.acquisitionTaxRules.find(
    (rule) =>
      rule.zoneType === "any" &&
      rule.specialRuralTaxRate !== undefined &&
      rule.areaThresholdM2 !== undefined &&
      conditions.areaM2 >= rule.areaThresholdM2 &&
      matchesHomeCount(rule, homeCount),
  );
  const ruralTax = ruralRule?.specialRuralTaxRate
    ? roundKRW(conditions.priceKRW * ruralRule.specialRuralTaxRate)
    : 0;

  return [
    toTaxItem(
      "acquisition_tax",
      "취득세",
      acquisitionTax,
      baseRule,
      `규칙 테이블의 '${baseRule.label}' 산식을 적용한 참고 금액입니다.`,
    ),
    educationTax === undefined
      ? expertTaxItem(baseRule.basisDate, "지방교육세 규칙값이 없어 별도 확인이 필요합니다.")
      : toTaxItem(
          "local_education_tax",
          "지방교육세",
          educationTax,
          baseRule,
          "규칙 테이블의 지방교육세율을 적용한 참고 금액입니다.",
        ),
    toTaxItem(
      "special_rural_tax",
      "농어촌특별세",
      ruralTax,
      ruralRule ?? baseRule,
      ruralRule
        ? "전용면적 85㎡ 초과 검토 규칙을 적용했습니다. 실제 과세 여부는 확인이 필요합니다."
        : "입력 면적이 85㎡ 이하라 검토용 규칙상 0원으로 표시합니다.",
    ),
  ];
}

function buildFeeItems(priceKRW: number, rules: CostRuleSet): CostItem[] {
  const grouped = new Map<string, IncidentalFeeRule[]>();
  for (const rule of rules.incidentalFeeRules) {
    grouped.set(rule.feeKey, [...(grouped.get(rule.feeKey) ?? []), rule]);
  }

  return Array.from(grouped.values()).flatMap((candidates): CostItem[] => {
    const rule = candidates.find((candidate) => matchesPrice(candidate, priceKRW));
    if (!rule) return [];
    const law = findLaw(rules, rule.lawRefId);
    const base = {
      key: rule.feeKey,
      label: rule.label,
      confidenceLabel: rule.confidenceLabel,
      basis: `${rules.source === "supabase" ? "DB" : "검토용 seed"} 부대비용 규칙: ${rule.label}`,
      explanation: rule.description,
      lawRefId: rule.lawRefId,
      lawRefTitle: law?.title,
      sourceUrl: law?.sourceUrl,
      basisDate: rule.basisDate,
    };

    if (rule.calculationType === "rate" && rule.rate !== undefined) {
      const calculated = roundKRW(priceKRW * rule.rate);
      return [{
        ...base,
        amountKRW: rule.capAmountKRW ? Math.min(calculated, rule.capAmountKRW) : calculated,
        isIncludedInTotal: true,
      }];
    }
    if (rule.calculationType === "fixed" && rule.fixedAmountKRW !== undefined) {
      return [{ ...base, amountKRW: rule.fixedAmountKRW, isIncludedInTotal: true }];
    }
    if (
      rule.calculationType === "range" &&
      rule.minAmountKRW !== undefined &&
      rule.maxAmountKRW !== undefined
    ) {
      return [{
        ...base,
        minAmountKRW: rule.minAmountKRW,
        maxAmountKRW: rule.maxAmountKRW,
        isIncludedInTotal: true,
      }];
    }
    return [{ ...base, isIncludedInTotal: false }];
  });
}

function findBaseTaxRule(
  conditions: BuyerConditions,
  rules: CostRuleSet,
): AcquisitionTaxRule | undefined {
  if (conditions.homeCountAfterPurchase === "unknown") return undefined;
  const homeCount = conditions.homeCountAfterPurchase;
  const exactZone = rules.acquisitionTaxRules.find(
    (rule) =>
      rule.zoneType === rules.zoneType &&
      rule.specialRuralTaxRate === undefined &&
      matchesHomeCount(rule, homeCount) &&
      matchesPrice(rule, conditions.priceKRW),
  );
  if (exactZone) return exactZone;
  return rules.acquisitionTaxRules.find(
    (rule) =>
      rule.zoneType === "common" &&
      rule.specialRuralTaxRate === undefined &&
      matchesHomeCount(rule, homeCount) &&
      matchesPrice(rule, conditions.priceKRW),
  );
}

function calculateAcquisitionRate(rule: AcquisitionTaxRule, priceKRW: number): number | undefined {
  if (rule.calculationType === "flat_rate") return rule.acquisitionTaxRate;
  if (rule.calculationType !== "linear_rate" || rule.formulaKey !== "price_linear_rate") {
    return undefined;
  }
  const p = rule.formulaParams;
  if (!p) return undefined;
  const values = [
    p.priceUnitKRW,
    p.coefficientNumerator,
    p.coefficientDenominator,
    p.offset,
    p.percentDivisor,
    p.decimalPlaces,
  ];
  if (values.some((value) => !Number.isFinite(value)) || p.coefficientDenominator === 0 || p.percentDivisor === 0) {
    return undefined;
  }
  const percent =
    (priceKRW / p.priceUnitKRW) *
      (p.coefficientNumerator / p.coefficientDenominator) -
    p.offset;
  const factor = 10 ** p.decimalPlaces;
  const roundedPercent = Math.round(percent * factor) / factor;
  return roundedPercent / p.percentDivisor;
}

function toTaxItem(
  key: string,
  label: string,
  amountKRW: number,
  rule: AcquisitionTaxRule,
  explanation: string,
): CostItem {
  return {
    key,
    label,
    amountKRW,
    confidenceLabel: "rule_based",
    basis: `검토용 취득세 규칙: ${rule.label} (${rule.verificationStatus})`,
    explanation,
    lawRefId: rule.lawRefId,
    basisDate: rule.basisDate,
    isIncludedInTotal: true,
  };
}

function expertTaxItem(
  basisDate: string,
  explanation: string,
  rule?: AcquisitionTaxRule,
): CostItem {
  return {
    key: "acquisition_tax",
    label: "취득세",
    confidenceLabel: "needs_expert_check",
    basis: rule ? `검토용 취득세 규칙: ${rule.label}` : "적용 규칙 별도 확인",
    explanation,
    lawRefId: rule?.lawRefId,
    basisDate,
    isIncludedInTotal: false,
  };
}

function buildRiskBadges(conditions: BuyerConditions, rules: CostRuleSet): RiskBadgeItem[] {
  const badges: RiskBadgeItem[] = [];
  if (rules.zoneType === "regulated") {
    badges.push({
      label: "규제지역",
      confidenceLabel: "variable",
      description: `${rules.zoneLabels.join(", ")} 검토용 규칙을 기준으로 표시했습니다. 최신 지정 여부를 확인하세요.`,
    });
  }
  if (conditions.homeCountAfterPurchase === 2 && rules.zoneType === "regulated") {
    badges.push({
      label: "취득세 중과 가능성",
      confidenceLabel: "needs_expert_check",
      description: "일시적 2주택 등 예외에 따라 중과 여부가 달라질 수 있습니다.",
    });
  }
  if (conditions.isFirstHomeBuyer === "unknown" || conditions.isFirstHomeBuyer) {
    badges.push({
      label: "생애최초 감면 확인 필요",
      confidenceLabel: "needs_expert_check",
      description: "감면을 합계에 확정 반영하지 않았습니다. 소유 이력 등 요건을 확인하세요.",
    });
  }
  if (conditions.willUseLoan !== false) {
    badges.push({
      label: "대출 규제 확인 필요",
      confidenceLabel: "needs_expert_check",
      description: "LTV·DSR과 실제 한도는 금융기관 심사에서 확인해야 합니다.",
    });
  }
  return badges;
}

function buildExemptionChecks(conditions: BuyerConditions): CheckCard[] {
  const cards: CheckCard[] = [];
  if (conditions.isFirstHomeBuyer !== false) {
    cards.push({
      title: "생애최초 취득세 감면",
      body: "감면 요건을 확정할 정보가 부족해 계산에 반영하지 않았습니다. 본인·배우자의 주택 소유 이력을 확인하세요.",
      confidenceLabel: "needs_expert_check",
    });
  }
  if (conditions.homeCountAfterPurchase === 2 || conditions.isTemporaryTwoHome !== "no") {
    cards.push({
      title: "일시적 2주택 예외",
      body: "기존 주택 처분 기한과 세대별 보유 현황에 따라 달라질 수 있어 별도 확인이 필요합니다.",
      confidenceLabel: "needs_expert_check",
    });
  }
  return cards;
}

function buildLoanNotes(conditions: BuyerConditions): CheckCard[] {
  if (conditions.willUseLoan === false) return [];
  return [{
    title: "LTV·DSR 확인 필요",
    body: "정밀 대출 한도는 계산하지 않았습니다. 소득, 기존 대출, 금융기관 심사 기준에 따라 달라질 수 있습니다.",
    confidenceLabel: "concept_only",
  }];
}

function buildExpertQuestions(conditions: BuyerConditions, rules: CostRuleSet): string[] {
  const questions = ["이 거래에서 취득세 과세표준과 적용 세율을 확인해 주세요."];
  if (conditions.isFirstHomeBuyer !== false) {
    questions.push("생애최초 취득세 감면 요건에 해당할 수 있는지 확인해 주세요.");
  }
  if (conditions.homeCountAfterPurchase === 2 || conditions.isTemporaryTwoHome !== "no") {
    questions.push("기존 주택 처분 시 일시적 2주택 예외를 적용받을 수 있는지 확인해 주세요.");
  }
  if (rules.zoneType === "regulated" && conditions.homeCountAfterPurchase !== 1) {
    questions.push("이 조건에서 취득세 중과 가능성이 있는지 확인해 주세요.");
  }
  questions.push("법무사 비용과 국민주택채권 실제 부담액을 확인해 주세요.");
  if (conditions.willUseLoan !== false) {
    questions.push("대출 심사에서 LTV·DSR 제한이 어떻게 적용될 수 있는지 확인해 주세요.");
  }
  return questions;
}

function buildConditionSummary(conditions: BuyerConditions, complex: Complex): string[] {
  return [
    complex.name,
    `${conditions.areaM2}㎡`,
    conditions.homeCountAfterPurchase === "unknown"
      ? "보유 주택 수 별도 확인"
      : `${conditions.homeCountAfterPurchase}주택 기준`,
    conditions.isActualResidence === "unknown"
      ? "실거주 여부 별도 확인"
      : conditions.isActualResidence
        ? "실거주 예정"
        : "실거주 미정",
  ];
}

function matchesHomeCount(rule: AcquisitionTaxRule, count: number): boolean {
  return count >= rule.homeCountMin && (rule.homeCountMax === undefined || count <= rule.homeCountMax);
}

function matchesPrice(
  rule: Pick<AcquisitionTaxRule | IncidentalFeeRule, "priceMinKRW" | "priceMaxKRW">,
  priceKRW: number,
): boolean {
  return (rule.priceMinKRW === undefined || priceKRW >= rule.priceMinKRW) &&
    (rule.priceMaxKRW === undefined || priceKRW <= rule.priceMaxKRW);
}

function findLaw(rules: CostRuleSet, id: string | undefined) {
  return id ? rules.lawReferences.find((law) => law.id === id) : undefined;
}

function roundKRW(value: number): number {
  return Math.round(value);
}
