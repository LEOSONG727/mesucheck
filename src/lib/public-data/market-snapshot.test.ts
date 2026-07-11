import { describe, expect, it } from "vitest";
import {
  buildMarketSnapshot,
  normalizeApartmentName,
} from "@/lib/public-data/market-stats";
import type { ApartmentRent, ApartmentTrade } from "@/types/public-data";

const trade = (
  dealDate: string,
  dealAmountKRW: number,
  isCancelled = false,
): ApartmentTrade => ({
  apartmentName: "테라팰리스건대2차",
  lawdCd: "11215",
  dongName: "자양동",
  jibun: "1",
  dealDate,
  dealAmountKRW,
  areaM2: 84.9,
  isCancelled,
  source: "molit_apt_trade",
});

const rent = (depositKRW: number, monthlyRentKRW = 0): ApartmentRent => ({
  apartmentName: "테라팰리스건대2차",
  lawdCd: "11215",
  dongName: "자양동",
  jibun: "1",
  dealDate: "2026-06-01",
  depositKRW,
  monthlyRentKRW,
  areaM2: 84.9,
  source: "molit_apt_rent",
});

describe("buildMarketSnapshot", () => {
  it("취소거래와 월세를 제외해 중앙값과 전세가율을 계산한다", () => {
    const result = buildMarketSnapshot(
      "테라팰리스 건대2차",
      84.9,
      ["202605", "202606"],
      "2026-07-11T00:00:00.000Z",
      [
        trade("2026-05-01", 900_000_000),
        trade("2026-06-01", 1_000_000_000),
        trade("2026-06-02", 2_000_000_000, true),
      ],
      [rent(500_000_000), rent(900_000_000, 1_000_000)],
    );

    expect(result.status).toBe("ok");
    expect(result.tradeCount).toBe(2);
    expect(result.medianTradePriceKRW).toBe(950_000_000);
    expect(result.recentTrade?.dealAmountKRW).toBe(1_000_000_000);
    expect(result.jeonseRatioPercent).toBe(52.6);
  });

  it("거래가 없으면 0원 통계를 만들지 않는다", () => {
    const result = buildMarketSnapshot(
      "없는단지",
      84.9,
      ["202606"],
      "2026-07-11T00:00:00.000Z",
      [],
      [],
    );
    expect(result.status).toBe("no_matching_transactions");
    expect(result.medianTradePriceKRW).toBeUndefined();
  });
});

describe("normalizeApartmentName", () => {
  it("공백과 괄호 차이만 제거한다", () => {
    expect(normalizeApartmentName("테라팰리스 건대(2차)"))
      .toBe(normalizeApartmentName("테라팰리스건대2차"));
  });
});
