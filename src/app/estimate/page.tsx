import { ConditionForm } from "@/components/ConditionForm";
import { getComplexById } from "@/data/mock-data";

type EstimatePageProps = {
  searchParams: Promise<{ complexId?: string }>;
};

export default async function EstimatePage({
  searchParams,
}: EstimatePageProps): Promise<React.ReactElement> {
  const { complexId } = await searchParams;
  const complex = getComplexById(complexId);

  return <ConditionForm complex={complex} />;
}
