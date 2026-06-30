import { formatKRWShort, getBasisDateLabel } from "@/lib/formatters";
import type { CostEstimateReport } from "@/types/maesucheck";

type ReportHeroProps = {
  report: CostEstimateReport;
};

export function ReportHero({ report }: ReportHeroProps): React.ReactElement {
  return (
    <section className="overflow-hidden rounded-[22px] bg-primary-strong p-6 text-white shadow-[var(--shadow-lifted)] md:p-8">
      <div className="mb-5 flex flex-wrap gap-2">
        {report.conditionSummary.slice(0, 4).map((item) => (
          <span
            className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-white/78"
            key={item}
          >
            {item}
          </span>
        ))}
      </div>
      <p className="text-sm font-semibold text-white/55">매매가 외 예상 추가 비용</p>
      <div className="mt-2 text-6xl font-black md:text-7xl">
        {formatKRWShort(report.summary.estimatedAdditionalCostKRW)}
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-white/10 p-4">
          <div className="text-xs font-semibold text-white/55">매매가</div>
          <div className="mt-1 text-2xl font-black">
            {formatKRWShort(report.summary.purchasePriceKRW)}
          </div>
        </div>
        <div className="rounded-2xl bg-white/10 p-4">
          <div className="text-xs font-semibold text-white/55">총 예상 매입 비용</div>
          <div className="mt-1 text-2xl font-black">
            {formatKRWShort(report.summary.estimatedTotalAcquisitionCostKRW)}
          </div>
        </div>
      </div>
      <p className="mt-5 max-w-3xl text-balance text-sm leading-7 text-white/66">
        입력한 조건 기준으로 이 집을 사기 위해 매매가 외에 약{" "}
        <strong className="text-white">
          {formatKRWShort(report.summary.estimatedAdditionalCostKRW)}
        </strong>
        이 추가로 필요할 수 있어요.
      </p>
      <div className="mt-5 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/60">
        {getBasisDateLabel(report.summary.basisDate)}
      </div>
    </section>
  );
}
