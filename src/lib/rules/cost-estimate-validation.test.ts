import { describe, expect, it } from "vitest";
import { defaultConditions } from "@/data/mock-data";
import {
  CostEstimateValidationError,
  parseCostEstimateRequest,
} from "@/lib/rules/cost-estimate-validation";

describe("cost estimate request validation", () => {
  it("정상 입력을 원 단위 정수로 정규화한다", () => {
    expect(parseCostEstimateRequest({ ...defaultConditions, priceKRW: 600_000_000.4 }).priceKRW)
      .toBe(600_000_000);
  });

  it("잘못된 금액과 상태값을 거부한다", () => {
    expect(() =>
      parseCostEstimateRequest({
        ...defaultConditions,
        priceKRW: -1,
        isTemporaryTwoHome: "maybe",
      }),
    ).toThrow(CostEstimateValidationError);
  });
});
