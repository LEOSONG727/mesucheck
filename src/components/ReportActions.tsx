"use client";

import { Copy, FileClock, RotateCcw } from "lucide-react";
import { useToast } from "@/components/ToastProvider";
import { Button, ButtonLink } from "@/components/ui/Button";
import { formatKRWShort } from "@/lib/formatters";
import type { CostEstimateReport } from "@/types/maesucheck";

type ReportActionsProps = {
  report: CostEstimateReport;
  layout?: "inline" | "stacked";
};

export function ReportActions({
  report,
  layout = "inline",
}: ReportActionsProps): React.ReactElement {
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
    <section
      className={
        layout === "stacked"
          ? "grid gap-2"
          : "grid gap-3 sm:grid-cols-[1fr_1.4fr_1fr]"
      }
    >
      <ButtonLink
        href={`/estimate?complexId=${report.input.complexId}`}
        leftIcon={<RotateCcw size={16} />}
        variant="secondary"
      >
        다시 계산
      </ButtonLink>
      <Button
        leftIcon={<Copy size={16} />}
        onClick={() => void copyFamilySummary()}
        variant="primary"
      >
        가족에게 공유할 요약 복사
      </Button>
      <Button
        leftIcon={<FileClock size={16} />}
        onClick={showPdfToast}
        variant="ghost"
      >
        PDF 준비 중
      </Button>
    </section>
  );
}
