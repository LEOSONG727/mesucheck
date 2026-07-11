import type {
  AcquisitionTaxRule,
  ConceptNoteRule,
  IncidentalFeeRule,
  LawReference,
} from "@/types/maesucheck";

export const RULE_BASIS_DATE = "2026-06-30";

const commonRule = {
  homeCountMin: 1,
  homeCountMax: 1,
  zoneType: "common" as const,
  description: "지방세법 제11조의 주택 유상거래 표준세율 검토용 규칙입니다.",
  lawRefId: "11111111-1111-4111-8111-111111111111",
  effectiveFrom: "2026-04-24",
  basisDate: RULE_BASIS_DATE,
  verificationStatus: "needs_review" as const,
};

export const seedAcquisitionTaxRules: AcquisitionTaxRule[] = [
  {
    ...commonRule,
    id: "seed-acquisition-under-600m",
    priceMinKRW: 0,
    priceMaxKRW: 600_000_000,
    calculationType: "flat_rate",
    acquisitionTaxRate: 0.01,
    localEducationTaxRate: 0.002,
    label: "1주택 6억 이하",
  },
  {
    ...commonRule,
    id: "seed-acquisition-600m-to-900m",
    priceMinKRW: 600_000_001,
    priceMaxKRW: 900_000_000,
    calculationType: "linear_rate",
    formulaKey: "price_linear_rate",
    formulaParams: {
      priceUnitKRW: 100_000_000,
      coefficientNumerator: 2,
      coefficientDenominator: 3,
      offset: 3,
      percentDivisor: 100,
      decimalPlaces: 4,
    },
    localEducationTaxRate: 0.002,
    label: "1주택 6억 초과 9억 이하",
  },
  {
    ...commonRule,
    id: "seed-acquisition-over-900m",
    priceMinKRW: 900_000_001,
    calculationType: "flat_rate",
    acquisitionTaxRate: 0.03,
    localEducationTaxRate: 0.002,
    label: "1주택 9억 초과",
  },
  {
    id: "seed-acquisition-regulated-two-home",
    homeCountMin: 2,
    homeCountMax: 2,
    zoneType: "regulated",
    priceMinKRW: 0,
    calculationType: "expert_check",
    label: "2주택 규제지역",
    description:
      "일시적 2주택 등 예외에 따라 중과 여부가 달라질 수 있어 금액을 확정하지 않습니다.",
    lawRefId: "11111111-1111-4111-8111-111111111111",
    effectiveFrom: "2026-04-24",
    basisDate: RULE_BASIS_DATE,
    verificationStatus: "needs_review",
  },
  {
    id: "seed-special-rural-over-85",
    homeCountMin: 1,
    zoneType: "any",
    priceMinKRW: 0,
    areaThresholdM2: 85.0001,
    calculationType: "flat_rate",
    specialRuralTaxRate: 0.002,
    label: "85㎡ 초과 농어촌특별세",
    description: "전용면적 85㎡ 초과 시 적용 가능성을 검토하는 규칙입니다.",
    lawRefId: "33333333-3333-4333-8333-333333333333",
    effectiveFrom: "2026-04-24",
    basisDate: RULE_BASIS_DATE,
    verificationStatus: "needs_review",
  },
];

const feeBase = {
  effectiveFrom: "2021-12-30",
  basisDate: RULE_BASIS_DATE,
  verificationStatus: "needs_review" as const,
};

export const seedIncidentalFeeRules: IncidentalFeeRule[] = [
  ...[
    ["under-50m", 0, 49_999_999, 0.006, 250_000],
    ["50m-to-200m", 50_000_000, 199_999_999, 0.005, 800_000],
    ["200m-to-900m", 200_000_000, 899_999_999, 0.004, undefined],
    ["900m-to-1200m", 900_000_000, 1_199_999_999, 0.005, undefined],
    ["1200m-to-1500m", 1_200_000_000, 1_499_999_999, 0.006, undefined],
    ["over-1500m", 1_500_000_000, undefined, 0.007, undefined],
  ].map(([suffix, min, max, rate, cap]) => ({
    ...feeBase,
    id: `seed-brokerage-${suffix}`,
    feeKey: "brokerage_fee",
    label: "부동산 중개보수 상한",
    calculationType: "rate" as const,
    priceMinKRW: min as number,
    priceMaxKRW: max as number | undefined,
    rate: rate as number,
    capAmountKRW: cap as number | undefined,
    confidenceLabel: "variable" as const,
    description:
      "서울시 주택 매매 중개보수 상한 기준이며 실제 보수는 상한 안에서 협의합니다.",
    lawRefId: "44444444-4444-4444-8444-444444444444",
  })),
  {
    ...feeBase,
    id: "seed-registration-related",
    feeKey: "registration_related",
    label: "등기 관련 비용",
    calculationType: "range",
    minAmountKRW: 1_200_000,
    maxAmountKRW: 2_600_000,
    confidenceLabel: "variable",
    description:
      "등기 방식, 법무사 이용 여부, 국민주택채권 부담에 따라 달라질 수 있습니다.",
  },
  {
    ...feeBase,
    id: "seed-stamp-and-legal",
    feeKey: "stamp_and_legal",
    label: "인지세 + 법무사 수수료",
    calculationType: "range",
    minAmountKRW: 700_000,
    maxAmountKRW: 1_800_000,
    confidenceLabel: "variable",
    description: "계약서와 등기 대리 범위에 따라 달라질 수 있습니다.",
  },
  {
    ...feeBase,
    id: "seed-national-housing-bond",
    feeKey: "national_housing_bond",
    label: "국민주택채권",
    calculationType: "manual_note",
    confidenceLabel: "needs_expert_check",
    description: "매입 및 할인 매각 방식에 따라 실제 부담액이 달라 별도 확인이 필요합니다.",
  },
];

export const seedLawReferences: LawReference[] = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    title: "지방세법 제11조",
    sourceUrl:
      "https://www.law.go.kr/LSW/lsLinkCommonInfo.do?chrClsCd=010202&lsJoLnkSeq=1026499869",
    basisDate: RULE_BASIS_DATE,
    verificationStatus: "needs_review",
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    title: "지방세법 제151조",
    sourceUrl: "https://www.law.go.kr",
    basisDate: RULE_BASIS_DATE,
    verificationStatus: "needs_review",
  },
  {
    id: "33333333-3333-4333-8333-333333333333",
    title: "농어촌특별세법 제5조",
    sourceUrl: "https://www.law.go.kr",
    basisDate: RULE_BASIS_DATE,
    verificationStatus: "needs_review",
  },
  {
    id: "44444444-4444-4444-8444-444444444444",
    title: "서울특별시 주택 중개보수 요율표",
    sourceUrl: "https://land.seoul.go.kr/land/broker/brokerageCommission.do",
    basisDate: RULE_BASIS_DATE,
    verificationStatus: "needs_review",
  },
];

export const seedConceptNotes: ConceptNoteRule[] = [
  {
    key: "capital_gains_tax",
    title: "양도소득세",
    summary: "나중에 집을 팔 때 검토하는 세금입니다.",
    body: "보유·거주 기간과 주택 수에 따라 크게 달라져 정밀 계산하지 않습니다.",
    confidenceLabel: "concept_only",
    basisDate: RULE_BASIS_DATE,
    verificationStatus: "needs_review",
  },
  {
    key: "comprehensive_real_estate_tax",
    title: "종합부동산세",
    summary: "공시가격 합계와 보유 조건에 따라 검토하는 세금입니다.",
    body: "개인별 공제와 보유 조건에 따라 달라져 참고 개념으로만 안내합니다.",
    confidenceLabel: "concept_only",
    basisDate: RULE_BASIS_DATE,
    verificationStatus: "needs_review",
  },
];
