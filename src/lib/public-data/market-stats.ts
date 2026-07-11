import { calculatePyeongPrice } from "@/lib/formatters";
import type {
  ApartmentRent,
  ApartmentTrade,
  ComplexMarketSnapshot,
} from "@/types/public-data";

export const AREA_TOLERANCE_M2 = 3;

export function buildMarketSnapshot(
  apartmentName: string,
  areaM2: number,
  requestedMonths: string[],
  fetchedAt: string,
  trades: ApartmentTrade[],
  rents: ApartmentRent[],
): ComplexMarketSnapshot {
  const validTrades = trades
    .filter((trade) => !trade.isCancelled && trade.dealAmountKRW > 0)
    .sort((a, b) => a.dealDate.localeCompare(b.dealDate));
  const pureJeonse = rents.filter(
    (rent) => rent.monthlyRentKRW === 0 && rent.depositKRW > 0,
  );

  if (validTrades.length === 0) {
    return {
      apartmentName,
      areaM2,
      fetchedAt,
      requestedMonths,
      tradeCount: 0,
      rentCount: pureJeonse.length,
      trend: [],
      status: "no_matching_transactions",
      message: `최근 ${requestedMonths.length}개월 내 동일 단지·유사 면적(±${AREA_TOLERANCE_M2}㎡) 매매가 없습니다.`,
    };
  }

  const prices = validTrades.map((trade) => trade.dealAmountKRW);
  const jeonseDeposits = pureJeonse.map((rent) => rent.depositKRW);
  const medianTradePriceKRW = median(prices);
  const firstMonth = validTrades[0];
  const recentTrade = validTrades.at(-1)!;

  return {
    apartmentName,
    areaM2,
    fetchedAt,
    requestedMonths,
    tradeCount: validTrades.length,
    rentCount: pureJeonse.length,
    recentTrade,
    medianTradePriceKRW,
    averageTradePriceKRW: Math.round(average(prices)),
    minTradePriceKRW: Math.min(...prices),
    maxTradePriceKRW: Math.max(...prices),
    jeonseRatioPercent:
      jeonseDeposits.length > 0
        ? round1((median(jeonseDeposits) / medianTradePriceKRW) * 100)
        : undefined,
    sixMonthChangePercent: round1(
      ((recentTrade.dealAmountKRW - firstMonth.dealAmountKRW) /
        firstMonth.dealAmountKRW) *
        100,
    ),
    trend: buildTrend(validTrades),
    status: "ok",
    message: "국토교통부 실거래가 공개시스템 조회 결과입니다.",
  };
}
export function normalizeApartmentName(value: string): string {
  return value.normalize("NFKC").replace(/[^0-9A-Za-z가-힣]/g, "").toLowerCase();
}

export function filterMatchingTrades(
  rows: ApartmentTrade[],
  apartmentName: string,
  areaM2: number,
): ApartmentTrade[] {
  const target = normalizeApartmentName(apartmentName);
  return rows.filter(
    (row) =>
      normalizeApartmentName(row.apartmentName) === target &&
      Math.abs(row.areaM2 - areaM2) <= AREA_TOLERANCE_M2,
  );
}

export function filterMatchingRents(
  rows: ApartmentRent[],
  apartmentName: string,
  areaM2: number,
): ApartmentRent[] {
  const target = normalizeApartmentName(apartmentName);
  return rows.filter(
    (row) =>
      normalizeApartmentName(row.apartmentName) === target &&
      Math.abs(row.areaM2 - areaM2) <= AREA_TOLERANCE_M2,
  );
}

function buildTrend(trades: ApartmentTrade[]): ComplexMarketSnapshot["trend"] {
  const grouped = new Map<string, ApartmentTrade[]>();
  for (const trade of trades) {
    const month = trade.dealDate.slice(0, 7).replace("-", ".");
    grouped.set(month, [...(grouped.get(month) ?? []), trade]);
  }
  return Array.from(grouped.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, rows]) => ({
      month,
      pyeongPriceKRW: Math.round(
        average(rows.map((row) => calculatePyeongPrice(row.dealAmountKRW, row.areaM2))),
      ),
      tradeCount: rows.length,
    }));
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle];
}

function average(values: number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}
