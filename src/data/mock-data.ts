import type {
  BuyerConditions,
  Complex,
  CostEstimateReport,
  CostItem,
  RiskBadgeItem,
} from "@/types/maesucheck";

export const BASIS_DATE = "2026-06-30";

export const REPORT_DISCLAIMER =
  "입력 조건 기준의 참고 리포트입니다. 실제 세금과 규제 적용은 세부 조건, 법령 변경, 관할 기관 판단에 따라 달라질 수 있어요. 최종 결정 전에는 세무사·공인중개사·법무사와 함께 확인하는 것이 안전합니다.";

const externalLinks = {
  naverLand: "https://m.land.naver.com",
  hogangnono: "https://hogangnono.com",
  zigbang: "https://www.zigbang.com",
};

const trend = [
  { month: "2026.01", pyeongPriceKRW: 39_600_000, tradeCount: 4 },
  { month: "2026.02", pyeongPriceKRW: 40_200_000, tradeCount: 5 },
  { month: "2026.03", pyeongPriceKRW: 40_900_000, tradeCount: 6 },
  { month: "2026.04", pyeongPriceKRW: 41_500_000, tradeCount: 4 },
  { month: "2026.05", pyeongPriceKRW: 42_300_000, tradeCount: 3 },
  { month: "2026.06", pyeongPriceKRW: 42_000_000, tradeCount: 5 },
];

export const complexes: Complex[] = [
  {
    id: "terrapalace-gundae-2",
    name: "테라팰리스 건대2차",
    sido: "서울특별시",
    sigungu: "광진구",
    dong: "자양동",
    lawdCd: "11215",
    address: "서울 광진구 자양동",
    builtYear: 2003,
    householdCount: 590,
    defaultAreaM2: 84.9,
    recentDealKRW: 920_000_000,
    recentDealDate: "2026-06-12",
    pyeongPriceKRW: 42_000_000,
    sixMonthChangePercent: 3.2,
    sixMonthTradeCount: 33,
    jeonseRatioPercent: 52.3,
    basisDate: BASIS_DATE,
    verificationStatus: "needs_review",
    zoneLabels: ["투기과열지구", "조정대상지역"],
    externalLinks,
    trend,
  },
  {
    id: "the-sharp-starcity",
    name: "더샵스타시티",
    sido: "서울특별시",
    sigungu: "광진구",
    dong: "자양동",
    lawdCd: "11215",
    address: "서울 광진구 자양동",
    builtYear: 2007,
    householdCount: 1177,
    defaultAreaM2: 84.9,
    recentDealKRW: 1_420_000_000,
    recentDealDate: "2026-06-09",
    pyeongPriceKRW: 55_200_000,
    sixMonthChangePercent: 1.4,
    sixMonthTradeCount: 18,
    jeonseRatioPercent: 48.1,
    basisDate: BASIS_DATE,
    verificationStatus: "needs_review",
    zoneLabels: ["투기과열지구"],
    externalLinks,
    trend: trend.map((point, index) => ({
      ...point,
      pyeongPriceKRW: 52_000_000 + index * 620_000,
      tradeCount: Math.max(2, point.tradeCount - 1),
    })),
  },
  {
    id: "raemian-premier-palace",
    name: "래미안프리미어팰리스",
    sido: "서울특별시",
    sigungu: "광진구",
    dong: "자양동",
    lawdCd: "11215",
    address: "서울 광진구 자양동",
    builtYear: 2018,
    householdCount: 264,
    defaultAreaM2: 84.7,
    recentDealKRW: 1_280_000_000,
    recentDealDate: "2026-06-18",
    pyeongPriceKRW: 49_900_000,
    sixMonthChangePercent: 2.1,
    sixMonthTradeCount: 12,
    jeonseRatioPercent: 50.7,
    basisDate: BASIS_DATE,
    verificationStatus: "needs_review",
    zoneLabels: ["투기과열지구"],
    externalLinks,
    trend: trend.map((point, index) => ({
      ...point,
      pyeongPriceKRW: 47_800_000 + index * 430_000,
      tradeCount: Math.max(1, point.tradeCount - 2),
    })),
  },
  {
    id: "eaton-tower-river-1",
    name: "이튼타워리버 1차",
    sido: "서울특별시",
    sigungu: "광진구",
    dong: "자양동",
    lawdCd: "11215",
    address: "서울 광진구 자양동",
    builtYear: 2006,
    householdCount: 300,
    defaultAreaM2: 84.8,
    recentDealKRW: 1_090_000_000,
    recentDealDate: "2026-05-28",
    pyeongPriceKRW: 45_100_000,
    sixMonthChangePercent: -0.8,
    sixMonthTradeCount: 9,
    jeonseRatioPercent: 54.6,
    basisDate: BASIS_DATE,
    verificationStatus: "needs_review",
    zoneLabels: ["조정대상지역"],
    externalLinks,
    trend: trend.map((point, index) => ({
      ...point,
      pyeongPriceKRW: 45_800_000 - index * 120_000,
      tradeCount: Math.max(1, point.tradeCount - 2),
    })),
  },
  {
    id: "lottecastle-eastpole",
    name: "구의역 롯데캐슬 이스트폴",
    sido: "서울특별시",
    sigungu: "광진구",
    dong: "자양동",
    lawdCd: "11215",
    address: "서울 광진구 자양동",
    builtYear: 2025,
    householdCount: 1063,
    defaultAreaM2: 84.9,
    recentDealKRW: 1_560_000_000,
    recentDealDate: "2026-06-03",
    pyeongPriceKRW: 60_800_000,
    sixMonthChangePercent: 0.6,
    sixMonthTradeCount: 7,
    jeonseRatioPercent: 45.4,
    basisDate: BASIS_DATE,
    verificationStatus: "needs_review",
    zoneLabels: ["투기과열지구", "신축"],
    externalLinks,
    trend: trend.map((point, index) => ({
      ...point,
      pyeongPriceKRW: 59_900_000 + index * 180_000,
      tradeCount: Math.max(1, point.tradeCount - 3),
    })),
  },
  {
    id: "jayang-hyundai",
    name: "자양현대",
    sido: "서울특별시",
    sigungu: "광진구",
    dong: "자양동",
    lawdCd: "11215",
    address: "서울 광진구 자양동",
    builtYear: 1995,
    householdCount: 560,
    defaultAreaM2: 84.9,
    recentDealKRW: 980_000_000,
    recentDealDate: "2026-05-19",
    pyeongPriceKRW: 38_200_000,
    sixMonthChangePercent: 1.1,
    sixMonthTradeCount: 15,
    jeonseRatioPercent: 56.2,
    basisDate: BASIS_DATE,
    verificationStatus: "needs_review",
    zoneLabels: ["조정대상지역"],
    externalLinks,
    trend: trend.map((point, index) => ({
      ...point,
      pyeongPriceKRW: 37_300_000 + index * 180_000,
    })),
  },
];

export const exampleSearchTerms = [
  "서울 광진구 자양동",
  "서울 강남구 대치동",
  "서울 송파구 잠실동",
];

export const loadingMessages = [
  "최근 실거래가를 확인하는 중입니다",
  "규제지역 여부를 확인하는 중입니다",
  "예상 세금과 부대비용을 계산하는 중입니다",
  "매수 리스크 리포트를 정리하는 중입니다",
];

export const defaultConditions: BuyerConditions = {
  complexId: "terrapalace-gundae-2",
  priceKRW: 920_000_000,
  areaM2: 84.9,
  homeCountAfterPurchase: 1,
  isActualResidence: true,
  isFirstHomeBuyer: "unknown",
  willUseLoan: true,
  isTemporaryTwoHome: "unknown",
  willDisposeExistingHome: "unknown",
};

const baseCostItems: CostItem[] = [
  {
    key: "acquisition_tax",
    label: "취득세",
    amountKRW: 27_600_000,
    confidenceLabel: "rule_based",
    basis: "검토용 취득세 규칙 데이터: 1주택 9억 초과 구간",
    explanation:
      "입력한 조건이 1주택 9억 초과 구간에 해당할 수 있어 취득세 항목으로 표시했어요. 초기 규칙 데이터는 검증 필요 상태입니다.",
    lawRefId: "11111111-1111-4111-8111-111111111111",
    lawRefTitle: "지방세법 제11조",
    sourceUrl: "https://www.law.go.kr",
    basisDate: BASIS_DATE,
    isIncludedInTotal: true,
  },
  {
    key: "local_education_tax",
    label: "지방교육세",
    amountKRW: 2_760_000,
    confidenceLabel: "rule_based",
    basis: "검토용 취득세 규칙 데이터: 지방교육세 참고 규칙",
    explanation:
      "취득세와 함께 검토하는 항목입니다. 실제 산식과 적용 여부는 세무 전문가 확인이 필요해요.",
    lawRefId: "22222222-2222-4222-8222-222222222222",
    lawRefTitle: "지방세법 제151조",
    sourceUrl: "https://www.law.go.kr",
    basisDate: BASIS_DATE,
    isIncludedInTotal: true,
  },
  {
    key: "special_rural_tax",
    label: "농어촌특별세",
    amountKRW: 0,
    confidenceLabel: "rule_based",
    basis: "검토용 취득세 규칙 데이터: 전용 85㎡ 이하 참고",
    explanation:
      "전용면적 85㎡ 이하 조건으로는 부과되지 않을 수 있어요. 면적과 거래 조건에 따라 다시 확인하세요.",
    lawRefId: "33333333-3333-4333-8333-333333333333",
    lawRefTitle: "농어촌특별세법 제5조",
    sourceUrl: "https://www.law.go.kr",
    basisDate: BASIS_DATE,
    isIncludedInTotal: true,
  },
  {
    key: "brokerage_fee",
    label: "부동산 중개보수",
    amountKRW: 5_520_000,
    confidenceLabel: "variable",
    basis: "검토용 부대비용 데이터: 거래금액 구간별 중개보수 상한",
    explanation:
      "중개보수는 거래금액 구간, 협의 여부, 부가세 처리에 따라 달라질 수 있어요.",
    lawRefId: "44444444-4444-4444-8444-444444444444",
    lawRefTitle: "공인중개사법 시행규칙 제20조",
    sourceUrl: "https://www.law.go.kr",
    basisDate: BASIS_DATE,
    isIncludedInTotal: true,
  },
  {
    key: "registration_related",
    label: "등기 관련 비용",
    minAmountKRW: 1_200_000,
    maxAmountKRW: 2_600_000,
    confidenceLabel: "variable",
    basis: "검토용 부대비용 데이터: 등기 관련 범위 항목",
    explanation:
      "등기 유형, 법무사 이용 여부, 국민주택채권 부담액에 따라 실제 금액이 달라질 수 있어요.",
    basisDate: BASIS_DATE,
    isIncludedInTotal: true,
  },
  {
    key: "stamp_and_legal",
    label: "인지세 + 법무사 수수료",
    amountKRW: 1_200_000,
    confidenceLabel: "variable",
    basis: "검토용 부대비용 데이터: 인지세 및 법무사 수수료 범위 항목",
    explanation:
      "계약서 인지세와 등기 대리 범위에 따라 달라질 수 있어요. 법무사 견적을 별도로 확인하세요.",
    basisDate: BASIS_DATE,
    isIncludedInTotal: true,
  },
  {
    key: "national_housing_bond",
    label: "국민주택채권",
    confidenceLabel: "needs_expert_check",
    basis: "검토용 부대비용 데이터: 별도 확인 항목",
    explanation:
      "등기 시 매입 및 할인 매각 방식에 따라 실제 부담이 달라질 수 있어 별도 확인이 필요해요.",
    basisDate: BASIS_DATE,
    isIncludedInTotal: false,
  },
];

const defaultRiskBadges: RiskBadgeItem[] = [
  {
    label: "규제지역",
    confidenceLabel: "variable",
    description:
      "자양동 규제지역 검토용 데이터를 기준으로 표시했어요. 실제 최신 지정 여부는 확인이 필요해요.",
  },
  {
    label: "대출 규제 확인",
    confidenceLabel: "needs_expert_check",
    description:
      "LTV·DSR은 소득, 기존 대출, 금융기관 심사에 따라 달라질 수 있어요.",
  },
  {
    label: "생애최초 감면 확인",
    confidenceLabel: "needs_expert_check",
    description:
      "본인·배우자 주택 소유 이력 등 세부 요건을 전문가와 함께 확인하세요.",
  },
];

export const expertQuestions = [
  "이 거래에서 취득세 과세표준이 어떻게 적용되는지 확인해 주세요.",
  "생애최초 취득세 감면 요건에 해당할 수 있는지 확인해 주세요.",
  "기존 주택 처분 시 일시적 2주택 예외를 적용받을 수 있는지 확인해 주세요.",
  "이 조건에서 취득세 중과 가능성이 있는지 확인해 주세요.",
  "법무사 비용과 국민주택채권 부담액은 어느 정도로 예상해야 하는지 확인해 주세요.",
  "대출 심사에서 LTV·DSR 제한이 어떻게 적용될 수 있는지 확인해 주세요.",
  "공동명의로 진행할 경우 세금과 대출 조건이 달라질 수 있는지 확인해 주세요.",
];

export function getComplexById(id: string | undefined): Complex {
  return complexes.find((complex) => complex.id === id) ?? complexes[0];
}

export function searchComplexes(query: string): Complex[] {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return complexes.slice(0, 3);
  }

  return complexes.filter((complex) => {
    const haystack = `${complex.name} ${complex.dong} ${complex.sigungu}`.toLowerCase();
    return haystack.includes(normalized);
  });
}

export function buildMockReport(
  partialConditions: Partial<BuyerConditions> = {},
): CostEstimateReport {
  const conditions = {
    ...defaultConditions,
    ...partialConditions,
  };
  const complex = getComplexById(conditions.complexId);
  const costItems = baseCostItems.map((item) => ({ ...item }));

  if (conditions.areaM2 > 85) {
    const ruralTax = costItems.find((item) => item.key === "special_rural_tax");
    if (ruralTax) {
      ruralTax.amountKRW = 1_840_000;
      ruralTax.explanation =
        "전용면적 85㎡ 초과 조건으로는 농어촌특별세가 발생할 수 있어요. 실제 적용 여부는 세무 전문가와 확인하세요.";
    }
  }

  const additionalCostKRW = costItems.reduce((sum, item) => {
    if (!item.isIncludedInTotal) {
      return sum;
    }

    if (typeof item.amountKRW === "number") {
      return sum + item.amountKRW;
    }

    if (
      typeof item.minAmountKRW === "number" &&
      typeof item.maxAmountKRW === "number"
    ) {
      return sum + Math.round((item.minAmountKRW + item.maxAmountKRW) / 2);
    }

    return sum;
  }, 0);

  const conditionSummary = [
    `${complex.name}`,
    `${conditions.areaM2}㎡`,
    conditions.homeCountAfterPurchase === "unknown"
      ? "보유 주택 수 별도 확인"
      : `${conditions.homeCountAfterPurchase}주택 기준`,
    conditions.isFirstHomeBuyer === "unknown"
      ? "생애최초 여부 잘 모르겠어요"
      : conditions.isFirstHomeBuyer
        ? "생애최초 가능성 있음"
        : "생애최초 아님",
    conditions.isActualResidence === "unknown"
      ? "실거주 여부 별도 확인"
      : conditions.isActualResidence
        ? "실거주 예정"
        : "실거주 미정",
    conditions.willUseLoan === "unknown"
      ? "대출 계획 별도 확인"
      : conditions.willUseLoan
        ? "대출 예정"
        : "대출 미예정",
  ];

  const riskBadges = [...defaultRiskBadges];
  if (
    conditions.homeCountAfterPurchase === 2 ||
    conditions.isTemporaryTwoHome === "unknown"
  ) {
    riskBadges.push({
      label: "일시적 2주택 확인",
      confidenceLabel: "needs_expert_check",
      description:
        "기존 주택 처분 기한과 예외 요건에 따라 취득세 부담이 달라질 수 있어요.",
    });
  }

  return {
    id: "demo",
    summary: {
      complexName: complex.name,
      purchasePriceKRW: conditions.priceKRW,
      estimatedAdditionalCostKRW: additionalCostKRW,
      estimatedTotalAcquisitionCostKRW: conditions.priceKRW + additionalCostKRW,
      basisDate: BASIS_DATE,
    },
    input: conditions,
    conditionSummary,
    costItems,
    riskBadges,
    exemptionChecks: [
      {
        title: "생애최초 취득세 감면",
        body: "본인·배우자 주택 소유 이력과 소득·가격 요건에 따라 달라질 수 있어요. 입력값이 불확실하면 별도 확인 항목으로 보세요.",
        confidenceLabel: "needs_expert_check",
      },
      {
        title: "일시적 2주택 예외",
        body: "기존 주택 처분 예정이 있거나 갈아타기 상황이라면 처분 기한과 계약 조건을 전문가와 함께 확인하세요.",
        confidenceLabel: "needs_expert_check",
      },
    ],
    loanNotes: [
      {
        title: "LTV·DSR 확인 필요",
        body: "정밀 대출 한도는 계산하지 않았어요. 소득, 기존 대출, 금융기관 심사 기준에 따라 달라질 수 있어요.",
        confidenceLabel: "concept_only",
      },
    ],
    conceptNotes: [
      {
        title: "양도소득세",
        body: "나중에 매도할 때 검토하는 세금이에요. 보유·거주 기간과 주택 수에 따라 크게 달라질 수 있어요.",
        confidenceLabel: "concept_only",
      },
      {
        title: "종합부동산세",
        body: "공시가격 합계와 보유 조건에 따라 검토하는 세금이에요. 지금은 참고 개념으로만 안내해요.",
        confidenceLabel: "concept_only",
      },
    ],
    expertCheckQuestions: expertQuestions,
    externalLinks: complex.externalLinks,
    disclaimer: REPORT_DISCLAIMER,
  };
}
