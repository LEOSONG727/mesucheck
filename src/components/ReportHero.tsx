import { formatKRWShort, getBasisDateLabel } from "@/lib/formatters";
import type { CostEstimateReport } from "@/types/maesucheck";

type ReportHeroProps = {
  report: CostEstimateReport;
};

export function ReportHero({ report }: ReportHeroProps): React.ReactElement {
  return (
    <section className="relative isolate overflow-hidden rounded-[30px] bg-primary-strong p-6 text-white shadow-[var(--shadow-lifted)] md:p-8">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,rgba(255,255,255,0.13),transparent_42%),linear-gradient(180deg,#101f32,#17324d)]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-px bg-white/35" />

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-white/14 px-3 py-1.5 text-xs font-black text-white/82">
          검토 리포트
        </span>
        {report.conditionSummary.slice(0, 4).map((item) => (
          <span
            className="rounded-full bg-white/8 px-3 py-1.5 text-xs font-bold text-white/72"
            key={item}
          >
            {item}
          </span>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
        <div>
          <p className="text-sm font-semibold text-white/58">매매가 외 예상 추가 비용</p>
          <div className="mt-2 text-[clamp(3rem,7vw,5.25rem)] font-black leading-none">
            {formatKRWShort(report.summary.estimatedAdditionalCostKRW)}
          </div>
          <p className="mt-5 max-w-3xl text-balance text-sm leading-7 text-white/68">
            입력한 조건 기준으로 이 집을 사기 위해 매매가 외에 약{" "}
            <strong className="text-white">
              {formatKRWShort(report.summary.estimatedAdditionalCostKRW)}
            </strong>
            이 추가로 필요할 수 있어요.
          </p>
        </div>

        <div className="grid gap-3">
          <HeroMetric
            label="매매가"
            value={formatKRWShort(report.summary.purchasePriceKRW)}
          />
          <HeroMetric
            label="총 예상 매입 비용"
            value={formatKRWShort(report.summary.estimatedTotalAcquisitionCostKRW)}
          />
          <div className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-xs font-bold text-white/62">
            {getBasisDateLabel(report.summary.basisDate)} · 참고 리포트
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}): React.ReactElement {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-4 shadow-[var(--shadow-crisp)]">
      <div className="text-xs font-semibold text-white/56">{label}</div>
      <div className="mt-1 text-2xl font-black">{value}</div>
    </div>
  );
}
