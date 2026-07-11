import { getComplexById } from "@/lib/repositories/complexes";
import { getCostRuleSet } from "@/lib/repositories/cost-rules";
import { calculateCostEstimate } from "@/lib/rules/cost-engine";
import { parseCostEstimateRequest } from "@/lib/rules/cost-estimate-validation";
import { defaultConditions } from "@/data/mock-data";
import type { BuyerConditions, CostEstimateReport } from "@/types/maesucheck";

export async function buildEstimateReport(
  partialConditions: Partial<BuyerConditions> = {},
): Promise<CostEstimateReport> {
  const input = parseCostEstimateRequest({ ...defaultConditions, ...partialConditions });
  const complex = await getComplexById(input.complexId);
  const rules = await getCostRuleSet(complex.lawdCd);
  return calculateCostEstimate(input, complex, rules);
}
