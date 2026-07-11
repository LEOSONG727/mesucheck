import { describe, expect, it } from "vitest";
import {
  RULE_BASIS_DATE,
  seedAcquisitionTaxRules,
  seedConceptNotes,
  seedIncidentalFeeRules,
  seedLawReferences,
} from "@/data/rule-seed";
import { complexes, defaultConditions } from "@/data/mock-data";
import { calculateCostEstimate } from "@/lib/rules/cost-engine";
import type { BuyerConditions, CostRuleSet } from "@/types/maesucheck";

const complex = complexes[0];

function rules(zoneType: "common" | "regulated" = "common"): CostRuleSet {
  return {
    acquisitionTaxRules: seedAcquisitionTaxRules,
    incidentalFeeRules: seedIncidentalFeeRules,
    lawReferences: seedLawReferences,
    conceptNotes: seedConceptNotes,
    zoneType,
    zoneLabels: zoneType === "regulated" ? ["조정대상지역"] : [],
    basisDate: RULE_BASIS_DATE,
    source: "seed_fallback",
  };
}

function conditions(overrides: Partial<BuyerConditions>): BuyerConditions {
  return { ...defaultConditions, ...overrides };
}

function amount(report: ReturnType<typeof calculateCostEstimate>, key: string): number | undefined {
  return report.costItems.find((item) => item.key === key)?.amountKRW;
}

describe("cost rule engine required cases", () => {
  it("case 1: 1주택 6억 이하 84㎡를 규칙 기반으로 계산한다", () => {
    const report = calculateCostEstimate(
      conditions({ priceKRW: 600_000_000, areaM2: 84, homeCountAfterPurchase: 1 }),
      complex,
      rules(),
    );

    expect(amount(report, "acquisition_tax")).toBe(6_000_000);
    expect(amount(report, "local_education_tax")).toBe(1_200_000);
    expect(amount(report, "special_rural_tax")).toBe(0);
    expect(report.summary.basisDate).toBe(RULE_BASIS_DATE);
    expect(report.disclaimer).toContain("참고 리포트");
  });

  it("case 2: 1주택 9억 초과 84.9㎡에 교육세와 변동비용을 포함한다", () => {
    const report = calculateCostEstimate(
      conditions({ priceKRW: 1_000_000_000, areaM2: 84.9, homeCountAfterPurchase: 1 }),
      complex,
      rules(),
    );

    expect(amount(report, "acquisition_tax")).toBe(30_000_000);
    expect(amount(report, "local_education_tax")).toBe(2_000_000);
    expect(amount(report, "special_rural_tax")).toBe(0);
    expect(amount(report, "brokerage_fee")).toBe(5_000_000);
    expect(report.costItems.find((item) => item.key === "registration_related")?.confidenceLabel)
      .toBe("variable");
  });

  it("case 3: 85㎡ 초과 시 농어촌특별세 항목을 계산한다", () => {
    const report = calculateCostEstimate(
      conditions({ priceKRW: 1_000_000_000, areaM2: 102, homeCountAfterPurchase: 1 }),
      complex,
      rules(),
    );

    expect(amount(report, "special_rural_tax")).toBe(2_000_000);
    expect(report.costItems.find((item) => item.key === "special_rural_tax")?.confidenceLabel)
      .toBe("rule_based");
  });

  it("case 4: 규제지역 2주택은 금액을 확정하지 않고 중과 가능성을 표시한다", () => {
    const report = calculateCostEstimate(
      conditions({
        priceKRW: 1_000_000_000,
        areaM2: 84.9,
        homeCountAfterPurchase: 2,
        isTemporaryTwoHome: "unknown",
      }),
      complex,
      rules("regulated"),
    );
    const tax = report.costItems.find((item) => item.key === "acquisition_tax");

    expect(tax?.amountKRW).toBeUndefined();
    expect(tax?.isIncludedInTotal).toBe(false);
    expect(tax?.confidenceLabel).toBe("needs_expert_check");
    expect(report.riskBadges.map((badge) => badge.label)).toEqual(
      expect.arrayContaining(["규제지역", "취득세 중과 가능성"]),
    );
  });

  it("case 5: 생애최초 unknown은 감면을 합계에 반영하지 않는다", () => {
    const report = calculateCostEstimate(
      conditions({ priceKRW: 900_000_000, isFirstHomeBuyer: "unknown" }),
      complex,
      rules(),
    );

    expect(report.riskBadges).toContainEqual(
      expect.objectContaining({
        label: "생애최초 감면 확인 필요",
        confidenceLabel: "needs_expert_check",
      }),
    );
    expect(report.costItems.some((item) => item.key.includes("exemption"))).toBe(false);
  });

  it("case 6: 대출 예정은 정밀 한도 대신 확인 카드만 반환한다", () => {
    const report = calculateCostEstimate(
      conditions({ willUseLoan: true }),
      complex,
      rules(),
    );

    expect(report.loanNotes).toContainEqual(
      expect.objectContaining({ title: "LTV·DSR 확인 필요", confidenceLabel: "concept_only" }),
    );
    expect(report.loanNotes[0].body).not.toMatch(/\d+억|\d+만원/);
  });

  it("6억 초과 9억 이하 산식은 규칙 파라미터로 계산한다", () => {
    const report = calculateCostEstimate(
      conditions({ priceKRW: 750_000_000, areaM2: 84.9, homeCountAfterPurchase: 1 }),
      complex,
      rules(),
    );

    expect(amount(report, "acquisition_tax")).toBe(15_000_000);
  });

  it("6~9억 구간은 법령 기준대로 세율 퍼센트를 소수점 넷째 자리에서 반올림한다", () => {
    const report = calculateCostEstimate(
      conditions({ priceKRW: 700_000_000, areaM2: 84.9, homeCountAfterPurchase: 1 }),
      complex,
      rules(),
    );

    expect(amount(report, "acquisition_tax")).toBe(11_666_900);
  });
});
