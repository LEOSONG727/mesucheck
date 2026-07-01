import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ComplexSummaryCard } from "@/components/ComplexSummaryCard";
import { StateView } from "@/components/StateView";
import { findComplexById } from "@/lib/repositories/complexes";

type ComplexPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ComplexPage({
  params,
}: ComplexPageProps): Promise<React.ReactElement> {
  const { id } = await params;

  if (id === "error") {
    return <StateView state="error" />;
  }

  const complex = await findComplexById(id);

  if (!complex) {
    return <StateView state="empty" />;
  }

  return (
    <section className="content-shell py-7">
      <Link
        className="focus-ring mb-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-text-subtle"
        href="/"
      >
        <ArrowLeft size={16} />
        검색으로 돌아가기
      </Link>
      <ComplexSummaryCard complex={complex} detailed />
    </section>
  );
}
