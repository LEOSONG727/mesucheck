import { describe, expect, it } from "vitest";
import {
  buildApartmentSearchResults,
  createPublicComplexId,
  parsePublicComplexId,
  recentYearMonths,
} from "@/lib/public-data/complex-discovery";
import type { ApartmentTrade } from "@/types/public-data";

const baseTrade: ApartmentTrade = {
  apartmentName: "테스트 아파트",
  lawdCd: "11215",
  dongName: "자양동",
  jibun: "1-1",
  dealDate: "2026-07-10",
  dealAmountKRW: 1_000_000_000,
  areaM2: 84.94,
  floor: 10,
  builtYear: 2020,
  isCancelled: false,
  source: "molit_apt_trade",
};

describe("public apartment discovery", () => {
  it("groups valid trades by exact apartment and rounded area", () => {
    const rows = buildApartmentSearchResults(
      [
        baseTrade,
        { ...baseTrade, dealDate: "2026-06-01", areaM2: 84.92 },
        { ...baseTrade, dealDate: "2026-07-11", isCancelled: true },
        { ...baseTrade, apartmentName: "다른 아파트", jibun: "2-2", areaM2: 59.8 },
      ],
      "서울특별시 광진구 자양동",
      "자양동",
    );

    expect(rows).toHaveLength(2);
    const target = rows.find((row) => row.apartmentName === "테스트 아파트")!;
    expect(target.tradeCount).toBe(2);
    expect(target.areas).toHaveLength(1);
    expect(target.areas[0]).toMatchObject({ areaM2: 84.9, tradeCount: 2 });
  });

  it("does not mix another legal dong", () => {
    const rows = buildApartmentSearchResults(
      [{ ...baseTrade, dongName: "구의동" }],
      "서울특별시 광진구 자양동",
      "자양동",
    );
    expect(rows).toEqual([]);
  });

  it("round-trips public complex identity", () => {
    const identity = {
      lawdCd: "11215",
      apartmentName: "테라팰리스 건대2차",
      areaM2: 84.9,
      fullLegalName: "서울특별시 광진구 자양동",
    };
    expect(parsePublicComplexId(createPublicComplexId(identity))).toEqual(identity);
    expect(parsePublicComplexId("public-v1:broken")).toBeNull();
  });

  it("builds deterministic recent year-months", () => {
    expect(recentYearMonths(3, new Date("2026-07-11T00:00:00Z"))).toEqual([
      "202605",
      "202606",
      "202607",
    ]);
  });
});
