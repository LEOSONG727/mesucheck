import { ConditionForm } from "@/components/ConditionForm";
import { getComplexById } from "@/lib/repositories/complexes";

type EstimatePageProps = {
  searchParams: Promise<{ complexId?: string }>;
};

export default async function EstimatePage({
  searchParams,
}: EstimatePageProps): Promise<React.ReactElement> {
  const { complexId } = await searchParams;
  const complex = await getComplexById(complexId);

  return <ConditionForm complex={complex} />;
}
