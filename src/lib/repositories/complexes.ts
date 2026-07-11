import {
  BASIS_DATE,
  complexes as mockComplexes,
  getComplexById as getMockComplexById,
} from "@/data/mock-data";
import { filterComplexes } from "@/lib/complex-search";
import { calculatePyeongPrice, safeNumber } from "@/lib/formatters";
import { parsePublicComplexId } from "@/lib/public-data/complex-discovery";
import { getComplexMarketSnapshot } from "@/lib/public-data/market-snapshot";
import { shouldUseSupabaseDataSource } from "@/lib/repositories/data-source";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Complex, TrendPoint } from "@/types/maesucheck";

type ComplexRow = {
  id: string;
  name: string;
  sido: string;
  sigungu: string;
  dong: string;
  lawd_cd: string;
  address: string | null;
  built_year: number | null;
  household_count: number | null;
  default_area_m2: number | string | null;
  naver_land_url: string | null;
  hogangnono_url: string | null;
  zigbang_url: string | null;
  basis_date: string;
  verification_status: string;
};

type TransactionRow = {
  complex_id: string;
  deal_ym: string;
  deal_date: string | null;
  deal_amount_krw: number | string;
  area_m2: number | string;
};

type RegulatedZoneRow = {
  lawd_cd: string;
  zone_type: string;
  is_active: boolean;
};

export const FALLBACK_BASIS_DATE = BASIS_DATE;

export async function getComplexes(): Promise<Complex[]> {
  if (!shouldUseSupabaseDataSource()) {
    return mockComplexes;
  }

  const supabaseComplexes = await fetchSupabaseComplexes();
  return supabaseComplexes.length > 0 ? supabaseComplexes : mockComplexes;
}

export async function searchComplexes(query: string): Promise<Complex[]> {
  return filterComplexes(await getComplexes(), query);
}

export async function findComplexById(id: string | undefined): Promise<Complex | null> {
  if (!id) {
    return null;
  }

  const publicIdentity = parsePublicComplexId(id);
  if (publicIdentity) {
    return getPublicDataComplex(id, publicIdentity);
  }

  const complexes = await getComplexes();
  return complexes.find((complex) => complex.id === id) ?? null;
}

export async function getComplexById(id: string | undefined): Promise<Complex> {
  const complex = await findComplexById(id);
  if (complex) return complex;
  if (id?.startsWith("public-v1:")) {
    throw new Error("선택한 공개데이터 단지를 다시 조회하지 못했습니다.");
  }
  return getMockComplexById(id);
}

export async function findComplexByIdWithLiveMarket(
  id: string | undefined,
): Promise<Complex | null> {
  const complex = await findComplexById(id);
  if (!complex) return null;

  const marketSnapshot = await getComplexMarketSnapshot(complex);
  if (marketSnapshot.status !== "ok" || !marketSnapshot.recentTrade) {
    return { ...complex, marketSnapshot };
  }

  return {
    ...complex,
    recentDealKRW: marketSnapshot.recentTrade.dealAmountKRW,
    recentDealDate: marketSnapshot.recentTrade.dealDate,
    pyeongPriceKRW: calculatePyeongPrice(
      marketSnapshot.recentTrade.dealAmountKRW,
      marketSnapshot.recentTrade.areaM2,
    ),
    sixMonthChangePercent:
      marketSnapshot.sixMonthChangePercent ?? complex.sixMonthChangePercent,
    sixMonthTradeCount: marketSnapshot.tradeCount,
    jeonseRatioPercent:
      marketSnapshot.jeonseRatioPercent ?? complex.jeonseRatioPercent,
    basisDate: marketSnapshot.recentTrade.dealDate,
    verificationStatus: "verified",
    trend: marketSnapshot.trend.length > 0 ? marketSnapshot.trend : complex.trend,
    marketSnapshot,
  };
}

async function fetchSupabaseComplexes(): Promise<Complex[]> {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return [];
  }

  const { data: complexData, error: complexError } = await supabase
    .from("complexes")
    .select(
      "id,name,sido,sigungu,dong,lawd_cd,address,built_year,household_count,default_area_m2,naver_land_url,hogangnono_url,zigbang_url,basis_date,verification_status",
    )
    .eq("lawd_cd", "11215")
    .order("name", { ascending: true });

  if (complexError || !complexData || complexData.length === 0) {
    return [];
  }

  const complexRows = complexData as ComplexRow[];
  const complexIds = complexRows.map((complex) => complex.id);
  const lawdCds = Array.from(new Set(complexRows.map((complex) => complex.lawd_cd)));

  const [transactionResult, zoneResult] = await Promise.all([
    supabase
      .from("transactions")
      .select("complex_id,deal_ym,deal_date,deal_amount_krw,area_m2")
      .in("complex_id", complexIds)
      .eq("transaction_type", "trade")
      .order("deal_date", { ascending: true }),
    supabase
      .from("regulated_zones")
      .select("lawd_cd,zone_type,is_active")
      .in("lawd_cd", lawdCds)
      .eq("is_active", true),
  ]);

  const transactions = transactionResult.error
    ? []
    : ((transactionResult.data ?? []) as TransactionRow[]);
  const zones = zoneResult.error ? [] : ((zoneResult.data ?? []) as RegulatedZoneRow[]);

  return complexRows.map((complex) =>
    mapComplexRow(
      complex,
      transactions.filter((transaction) => transaction.complex_id === complex.id),
      zones.filter((zone) => zone.lawd_cd === complex.lawd_cd),
    ),
  );
}

async function getPublicDataComplex(
  id: string,
  identity: NonNullable<ReturnType<typeof parsePublicComplexId>>,
): Promise<Complex | null> {
  const snapshot = await getComplexMarketSnapshot({
    name: identity.apartmentName,
    lawdCd: identity.lawdCd,
    defaultAreaM2: identity.areaM2,
  });
  if (snapshot.status !== "ok" || !snapshot.recentTrade) {
    return null;
  }

  const locationParts = identity.fullLegalName.split(/\s+/).filter(Boolean);
  const recent = snapshot.recentTrade;
  return {
    id,
    name: identity.apartmentName,
    sido: locationParts[0] ?? "",
    sigungu: locationParts.slice(1, -1).join(" "),
    dong: recent.dongName || locationParts.at(-1) || "",
    lawdCd: identity.lawdCd,
    address: `${identity.fullLegalName} ${recent.jibun}`.trim(),
    builtYear: recent.builtYear ?? 0,
    householdCount: 0,
    defaultAreaM2: identity.areaM2,
    recentDealKRW: recent.dealAmountKRW,
    recentDealDate: recent.dealDate,
    pyeongPriceKRW: calculatePyeongPrice(recent.dealAmountKRW, recent.areaM2),
    sixMonthChangePercent: snapshot.sixMonthChangePercent ?? 0,
    sixMonthTradeCount: snapshot.tradeCount,
    jeonseRatioPercent: snapshot.jeonseRatioPercent ?? 0,
    basisDate: recent.dealDate,
    verificationStatus: "verified",
    zoneLabels: ["규제지역 별도 확인"],
    externalLinks: {
      naverLand: "https://m.land.naver.com",
      hogangnono: "https://hogangnono.com",
      zigbang: "https://www.zigbang.com",
    },
    trend: snapshot.trend,
    marketSnapshot: snapshot,
  };
}

function mapComplexRow(
  row: ComplexRow,
  transactions: TransactionRow[],
  zones: RegulatedZoneRow[],
): Complex {
  const fallback = mockComplexes.find((complex) => complex.name === row.name);
  const sortedTransactions = [...transactions].sort((a, b) =>
    getTransactionSortKey(a).localeCompare(getTransactionSortKey(b)),
  );
  const firstTransaction = sortedTransactions[0];
  const latestTransaction = sortedTransactions.at(-1);
  const defaultAreaM2 = safeNumber(
    row.default_area_m2,
    fallback?.defaultAreaM2 ?? 84.9,
  );
  const recentDealKRW = safeNumber(
    latestTransaction?.deal_amount_krw,
    fallback?.recentDealKRW ?? 0,
  );
  const latestAreaM2 = safeNumber(latestTransaction?.area_m2, defaultAreaM2);
  const pyeongPriceKRW =
    calculatePyeongPrice(recentDealKRW, latestAreaM2) ||
    fallback?.pyeongPriceKRW ||
    0;
  const firstPyeongPriceKRW = firstTransaction
    ? calculatePyeongPrice(firstTransaction.deal_amount_krw, firstTransaction.area_m2)
    : 0;
  const trend = buildTrendPoints(sortedTransactions);
  const zoneLabels =
    zones.length > 0
      ? zones.map((zone) => zone.zone_type)
      : fallback?.zoneLabels ?? ["검토 필요"];

  return {
    id: row.id,
    name: row.name,
    sido: row.sido,
    sigungu: row.sigungu,
    dong: row.dong,
    lawdCd: row.lawd_cd,
    address: row.address ?? fallback?.address ?? `${row.sido} ${row.sigungu} ${row.dong}`,
    builtYear: row.built_year ?? fallback?.builtYear ?? 0,
    householdCount: row.household_count ?? fallback?.householdCount ?? 0,
    defaultAreaM2,
    recentDealKRW,
    recentDealDate:
      latestTransaction?.deal_date ??
      fallback?.recentDealDate ??
      `${row.basis_date}`,
    pyeongPriceKRW,
    sixMonthChangePercent: calculateChangePercent(
      firstPyeongPriceKRW,
      pyeongPriceKRW,
      fallback?.sixMonthChangePercent ?? 0,
    ),
    sixMonthTradeCount:
      sortedTransactions.length || fallback?.sixMonthTradeCount || 0,
    jeonseRatioPercent: fallback?.jeonseRatioPercent ?? 0,
    basisDate: row.basis_date,
    verificationStatus: normalizeVerificationStatus(row.verification_status),
    zoneLabels,
    externalLinks: {
      naverLand: row.naver_land_url ?? fallback?.externalLinks.naverLand,
      hogangnono: row.hogangnono_url ?? fallback?.externalLinks.hogangnono,
      zigbang: row.zigbang_url ?? fallback?.externalLinks.zigbang,
    },
    trend: trend.length > 0 ? trend : fallback?.trend ?? [],
  };
}

function buildTrendPoints(transactions: TransactionRow[]): TrendPoint[] {
  const grouped = new Map<string, { totalPyeongPriceKRW: number; tradeCount: number }>();

  for (const transaction of transactions) {
    const pyeongPriceKRW = calculatePyeongPrice(
      transaction.deal_amount_krw,
      transaction.area_m2,
    );

    if (pyeongPriceKRW <= 0) {
      continue;
    }

    const month = normalizeDealMonth(transaction);
    const current = grouped.get(month) ?? {
      totalPyeongPriceKRW: 0,
      tradeCount: 0,
    };

    grouped.set(month, {
      totalPyeongPriceKRW: current.totalPyeongPriceKRW + pyeongPriceKRW,
      tradeCount: current.tradeCount + 1,
    });
  }

  return Array.from(grouped.entries())
    .sort(([left], [right]) => left.localeCompare(right))
    .slice(-6)
    .map(([month, item]) => ({
      month,
      pyeongPriceKRW: Math.round(item.totalPyeongPriceKRW / item.tradeCount),
      tradeCount: item.tradeCount,
    }));
}

function normalizeDealMonth(transaction: TransactionRow): string {
  if (/^\d{6}$/.test(transaction.deal_ym)) {
    return `${transaction.deal_ym.slice(0, 4)}.${transaction.deal_ym.slice(4)}`;
  }

  if (transaction.deal_date) {
    return transaction.deal_date.slice(0, 7).replace("-", ".");
  }

  return BASIS_DATE.slice(0, 7).replace("-", ".");
}

function getTransactionSortKey(transaction: TransactionRow): string {
  return transaction.deal_date ?? `${transaction.deal_ym}01`;
}

function calculateChangePercent(
  firstValue: number,
  latestValue: number,
  fallback: number,
): number {
  if (firstValue <= 0 || latestValue <= 0) {
    return fallback;
  }

  return Math.round(((latestValue - firstValue) / firstValue) * 1000) / 10;
}

function normalizeVerificationStatus(value: string): Complex["verificationStatus"] {
  return value === "verified" ? "verified" : "needs_review";
}
