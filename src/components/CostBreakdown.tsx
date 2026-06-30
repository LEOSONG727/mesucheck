"use client";

import { ConfidenceLabel } from "@/components/ConfidenceLabel";
import { EvidenceAccordion } from "@/components/EvidenceAccordion";
import { formatKRWShort } from "@/lib/formatters";
import type { CostEstimateReport } from "@/types/maesucheck";
import { useState } from "react";

type CostBreakdownProps = {
  report: CostEstimateReport;
};

export function CostBreakdown({ report }: CostBreakdownProps): React.ReactElement {
  const [expanded, setExpanded] = useState(false);
  const visibleItems = expanded ? report.costItems : report.costItems.slice(0, 3);
  const hiddenCount = Math.max(report.costItems.length - 3, 0);

  return (
    <section>
      <div className="mb-3 text-xs font-extrabold tracking-[0.08em] text-muted">
        비용 Breakdown
      </div>
      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-[var(--shadow-soft)]">
        {visibleItems.map((item) => (
          <div className="border-b border-[var(--border)] last:border-b-0" key={item.key}>
            <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="font-black">{item.label}</span>
                  <ConfidenceLabel value={item.confidenceLabel} />
                </div>
                <p className="text-sm leading-6 text-text-subtle">{item.explanation}</p>
              </div>
              <div className="shrink-0 text-left sm:text-right">
                <div className="text-xl font-black">
                  {typeof item.amountKRW === "number"
                    ? item.amountKRW === 0
                      ? "0원"
                      : formatKRWShort(item.amountKRW)
                    : item.minAmountKRW && item.maxAmountKRW
                      ? `${formatKRWShort(item.minAmountKRW)}-${formatKRWShort(
                          item.maxAmountKRW,
                        )}`
                      : "별도 확인"}
                </div>
                <div className="mt-1 text-xs font-bold text-muted">
                  {item.isIncludedInTotal ? "합계 포함" : "합계 미포함"}
                </div>
              </div>
            </div>
            <EvidenceAccordion
              basis={item.basis}
              basisDate={item.basisDate}
              explanation={item.explanation}
              sourceUrl={item.sourceUrl}
              title={item.lawRefTitle ?? item.label}
            />
          </div>
        ))}
        {hiddenCount > 0 ? (
          <button
            className="focus-ring flex min-h-12 w-full items-center justify-center bg-surface-muted px-4 text-sm font-extrabold text-primary"
            onClick={() => setExpanded((current) => !current)}
            type="button"
          >
            {expanded ? "비용 간단히 보기" : `나머지 비용 ${hiddenCount}개 자세히 보기`}
          </button>
        ) : null}
      </div>
    </section>
  );
}
