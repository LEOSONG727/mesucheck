"use client";

import Link from "next/link";
import { Copy, FileClock, RotateCcw } from "lucide-react";
import { useToast } from "@/components/ToastProvider";
import { formatKRWShort } from "@/lib/formatters";
import type { CostEstimateReport } from "@/types/maesucheck";

type ReportActionsProps = {
  report: CostEstimateReport;
};

export function ReportActions({ report }: ReportActionsProps): React.ReactElement {
  const { showToast } = useToast();

  async function copyFamilySummary(): Promise<void> {
    const text = [
      "매수체크 참고 리포트",
      `단지: ${report.summary.complexName}`,
      `매매가: ${formatKRWShort(report.summary.purchasePriceKRW)}`,
      `매매가 외 예상 추가 비용: ${formatKRWShort(
        report.summary.estimatedAdditionalCostKRW,
      )}`,
      `기준일: ${report.summary.basisDate}`,
      report.disclaimer,
    ].join("\n");

    await navigator.clipboard.writeText(text);
    showToast("가족에게 공유할 요약을 복사했어요.");
  }

  function showPdfToast(): void {
    showToast("PDF 리포트 기능을 준비 중이에요.");
  }

  return (
    <section className="grid gap-3 sm:grid-cols-[1fr_1.4fr_1fr]">
      <Link
        className="focus-ring flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[var(--border-strong)] bg-white px-4 text-sm font-bold text-text-subtle"
        href={`/estimate?complexId=${report.input.complexId}`}
      >
        <RotateCcw size={16} />
        다시 계산
      </Link>
      <button
        className="focus-ring flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-extrabold text-white"
        onClick={() => void copyFamilySummary()}
        type="button"
      >
        <Copy size={16} />
        가족에게 공유할 요약 복사
      </button>
      <button
        className="focus-ring flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-white px-4 text-sm font-bold text-text-subtle"
        onClick={showPdfToast}
        type="button"
      >
        <FileClock size={16} />
        PDF 준비 중
      </button>
    </section>
  );
}
