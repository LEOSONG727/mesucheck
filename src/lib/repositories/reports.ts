import { buildMockReport } from "@/data/mock-data";
import { getComplexById } from "@/lib/repositories/complexes";
import type { BuyerConditions, CostEstimateReport } from "@/types/maesucheck";

export async function buildEstimateReport(
  partialConditions: Partial<BuyerConditions> = {},
): Promise<CostEstimateReport> {
  const mockReport = buildMockReport(partialConditions);
  const complex = await getComplexById(mockReport.input.complexId);

  return {
    ...mockReport,
    summary: {
      ...mockReport.summary,
      complexName: complex.name,
      basisDate: complex.basisDate,
    },
    input: {
      ...mockReport.input,
      complexId: complex.id,
    },
    conditionSummary: [complex.name, ...mockReport.conditionSummary.slice(1)],
    externalLinks: complex.externalLinks,
  };
}
