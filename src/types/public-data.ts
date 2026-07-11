export type PublicDataSource = "molit_apt_trade" | "molit_apt_rent";

export type ApartmentTrade = {
  apartmentName: string;
  apartmentId?: string;
  lawdCd: string;
  dongName: string;
  jibun: string;
  dealDate: string;
  dealAmountKRW: number;
  areaM2: number;
  floor?: number;
  builtYear?: number;
  isCancelled: boolean;
  source: "molit_apt_trade";
};

export type ApartmentRent = {
  apartmentName: string;
  apartmentId?: string;
  lawdCd: string;
  dongName: string;
  jibun: string;
  dealDate: string;
  depositKRW: number;
  monthlyRentKRW: number;
  areaM2: number;
  floor?: number;
  builtYear?: number;
  source: "molit_apt_rent";
};

export type LegalDong = {
  regionCode: string;
  lawdCd: string;
  sidoCode: string;
  sigunguCode: string;
  eupMyeonDongCode: string;
  fullName: string;
  lowestName: string;
};

export type PublicApiMeta = {
  source: PublicDataSource;
  requestedMonths: string[];
  fetchedAt: string;
  totalRows: number;
};

export type PublicApartmentAreaOption = {
  complexId: string;
  areaM2: number;
  tradeCount: number;
  recentDealDate: string;
  recentDealAmountKRW: number;
};

export type PublicApartmentSearchResult = {
  apartmentName: string;
  lawdCd: string;
  dongName: string;
  jibun: string;
  builtYear?: number;
  tradeCount: number;
  recentDealDate: string;
  recentDealAmountKRW: number;
  areas: PublicApartmentAreaOption[];
};

export type PublicComplexIdentity = {
  lawdCd: string;
  apartmentName: string;
  areaM2: number;
  fullLegalName: string;
};

export type ComplexMarketSnapshot = {
  apartmentName: string;
  areaM2: number;
  fetchedAt: string;
  requestedMonths: string[];
  tradeCount: number;
  rentCount: number;
  recentTrade?: ApartmentTrade;
  medianTradePriceKRW?: number;
  averageTradePriceKRW?: number;
  minTradePriceKRW?: number;
  maxTradePriceKRW?: number;
  jeonseRatioPercent?: number;
  sixMonthChangePercent?: number;
  trend: Array<{ month: string; pyeongPriceKRW: number; tradeCount: number }>;
  status: "ok" | "no_matching_transactions" | "unavailable";
  message: string;
};
