import "server-only";

import {
  fetchApartmentRents,
  fetchApartmentTrades,
} from "@/lib/public-data/client";
import {
  buildMarketSnapshot,
  filterMatchingRents,
  filterMatchingTrades,
} from "@/lib/public-data/market-stats";
import type { Complex } from "@/types/maesucheck";
import type { ComplexMarketSnapshot } from "@/types/public-data";

export async function getComplexMarketSnapshot(
  complex: Pick<Complex, "name" | "lawdCd" | "defaultAreaM2">,
  monthCount = 6,
): Promise<ComplexMarketSnapshot> {
  const requestedMonths = recentYearMonths(monthCount);
  const fetchedAt = new Date().toISOString();

  try {
    const monthly = await Promise.all(
      requestedMonths.map(async (month) => {
        const [trades, rents] = await Promise.all([
          fetchApartmentTrades(complex.lawdCd, month),
          fetchApartmentRents(complex.lawdCd, month),
        ]);
        return { trades, rents };
      }),
    );
    const trades = filterMatchingTrades(
      monthly.flatMap((item) => item.trades),
      complex.name,
      complex.defaultAreaM2,
    );
    const rents = filterMatchingRents(
      monthly.flatMap((item) => item.rents),
      complex.name,
      complex.defaultAreaM2,
    );
    return buildMarketSnapshot(
      complex.name,
      complex.defaultAreaM2,
      requestedMonths,
      fetchedAt,
      trades,
      rents,
    );
  } catch (error) {
    return {
      apartmentName: complex.name,
      areaM2: complex.defaultAreaM2,
      fetchedAt,
      requestedMonths,
      tradeCount: 0,
      rentCount: 0,
      trend: [],
      status: "unavailable",
      message: error instanceof Error ? error.message : "공공데이터 조회에 실패했습니다.",
    };
  }
}

function recentYearMonths(count: number): string[] {
  const now = new Date();
  const values: string[] = [];
  for (let offset = count - 1; offset >= 0; offset -= 1) {
    const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - offset, 1));
    values.push(`${date.getUTCFullYear()}${String(date.getUTCMonth() + 1).padStart(2, "0")}`);
  }
  return values;
}
