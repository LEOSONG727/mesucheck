import type { BuyerConditions, CostEstimateRequest, TriState } from "@/types/maesucheck";

export class CostEstimateValidationError extends Error {
  constructor(public readonly issues: string[]) {
    super("비용 견적 입력값을 확인해 주세요.");
    this.name = "CostEstimateValidationError";
  }
}

export function parseCostEstimateRequest(value: unknown): CostEstimateRequest {
  if (!isRecord(value)) {
    throw new CostEstimateValidationError(["요청 본문은 JSON 객체여야 합니다."]);
  }

  const issues: string[] = [];
  const complexId = readString(value.complexId, "complexId", issues);
  const priceKRW = readPositiveNumber(value.priceKRW, "priceKRW", issues);
  const areaM2 = readPositiveNumber(value.areaM2, "areaM2", issues);
  const homeCountAfterPurchase = readHomeCount(value.homeCountAfterPurchase, issues);
  const isActualResidence = readBooleanUnknown(value.isActualResidence, "isActualResidence", issues);
  const isFirstHomeBuyer = readBooleanUnknown(value.isFirstHomeBuyer, "isFirstHomeBuyer", issues);
  const willUseLoan = readBooleanUnknown(value.willUseLoan, "willUseLoan", issues);
  const isTemporaryTwoHome = readTriState(value.isTemporaryTwoHome, "isTemporaryTwoHome", issues);
  const willDisposeExistingHome = readTriState(
    value.willDisposeExistingHome,
    "willDisposeExistingHome",
    issues,
  );

  if (issues.length > 0) {
    throw new CostEstimateValidationError(issues);
  }

  return {
    complexId: complexId!,
    priceKRW: Math.round(priceKRW!),
    areaM2: areaM2!,
    homeCountAfterPurchase: homeCountAfterPurchase!,
    isActualResidence: isActualResidence!,
    isFirstHomeBuyer: isFirstHomeBuyer!,
    willUseLoan: willUseLoan!,
    isTemporaryTwoHome: isTemporaryTwoHome!,
    willDisposeExistingHome: willDisposeExistingHome!,
  } satisfies BuyerConditions;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(value: unknown, key: string, issues: string[]): string | undefined {
  if (typeof value !== "string" || value.trim().length === 0) {
    issues.push(`${key}는 비어 있지 않은 문자열이어야 합니다.`);
    return undefined;
  }
  return value.trim();
}

function readPositiveNumber(value: unknown, key: string, issues: string[]): number | undefined {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    issues.push(`${key}는 0보다 큰 숫자여야 합니다.`);
    return undefined;
  }
  return value;
}

function readHomeCount(
  value: unknown,
  issues: string[],
): number | "unknown" | undefined {
  if (value === "unknown") {
    return value;
  }
  if (typeof value !== "number" || !Number.isInteger(value) || value < 1 || value > 20) {
    issues.push("homeCountAfterPurchase는 1~20의 정수 또는 unknown이어야 합니다.");
    return undefined;
  }
  return value;
}

function readBooleanUnknown(
  value: unknown,
  key: string,
  issues: string[],
): boolean | "unknown" | undefined {
  if (typeof value === "boolean" || value === "unknown") {
    return value;
  }
  issues.push(`${key}는 boolean 또는 unknown이어야 합니다.`);
  return undefined;
}

function readTriState(value: unknown, key: string, issues: string[]): TriState | undefined {
  if (value === "yes" || value === "no" || value === "unknown") {
    return value;
  }
  issues.push(`${key}는 yes, no, unknown 중 하나여야 합니다.`);
  return undefined;
}
