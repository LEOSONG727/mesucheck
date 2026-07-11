import { getComplexById } from "@/lib/repositories/complexes";
import { getCostRuleSet } from "@/lib/repositories/cost-rules";
import { calculateCostEstimate } from "@/lib/rules/cost-engine";
import {
  CostEstimateValidationError,
  parseCostEstimateRequest,
} from "@/lib/rules/cost-estimate-validation";

export async function POST(request: Request): Promise<Response> {
  try {
    const input = parseCostEstimateRequest(await request.json());
    const complex = await getComplexById(input.complexId);
    const rules = await getCostRuleSet(complex.lawdCd);
    const report = calculateCostEstimate(input, complex, rules);
    return Response.json(report, { status: 200 });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return Response.json(
        { error: "invalid_json", message: "올바른 JSON 요청 본문이 필요합니다." },
        { status: 400 },
      );
    }
    if (error instanceof CostEstimateValidationError) {
      return Response.json(
        { error: "invalid_input", message: error.message, issues: error.issues },
        { status: 400 },
      );
    }
    console.error("cost-estimate failed", error);
    return Response.json(
      { error: "estimate_failed", message: "비용 견적을 만들지 못했습니다. 잠시 후 다시 시도해 주세요." },
      { status: 500 },
    );
  }
}
