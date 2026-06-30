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

export type WatchlistItem = {
  complexId: string;
  complexName: string;
  dong: string;
  savedAt: string;
  recentDealKRW: number;
  estimatedAdditionalCostKRW?: number;
  riskLabels: string[];
};
