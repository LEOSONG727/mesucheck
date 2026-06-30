import Link from "next/link";
import { ArrowRight, Building2, CalendarDays, Home, MapPin } from "lucide-react";
import { ExternalListingLinks } from "@/components/ExternalListingLinks";
import { TrendChart } from "@/components/TrendChart";
import { WatchlistCTA } from "@/components/WatchlistCTA";
import {
  formatAreaM2,
  formatKRWShort,
  formatPyeong,
  getBasisDateLabel,
} from "@/lib/formatters";
import type { Complex } from "@/types/maesucheck";

type ComplexSummaryCardProps = {
  complex: Complex;
  detailed?: boolean;
};

export function ComplexSummaryCard({
  complex,
  detailed = false,
}: ComplexSummaryCardProps): React.ReactElement {
  return (
    <article className="grid gap-5">
      <section className="card overflow-hidden">
        <div className="border-b border-[var(--border)] bg-white p-5 md:p-6">
          <div className="mb-2 flex items-center gap-2 text-sm font-bold text-muted">
            <MapPin size={16} />
            {complex.sido} {complex.sigungu} {complex.dong}
          </div>
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-3xl font-black md:text-4xl">
                {complex.name}
              </h1>
              <div className="mt-3 flex flex-wrap gap-2">
                {complex.zoneLabels.map((label) => (
                  <span
                    className="rounded-full bg-warning-soft px-3 py-1 text-xs font-extrabold text-warning"
                    key={label}
                  >
                    {label}
                  </span>
                ))}
                <span className="rounded-full border border-[var(--border)] bg-surface-muted px-3 py-1 text-xs font-bold text-text-subtle">
                  {complex.builtYear}년 · {complex.householdCount.toLocaleString("ko-KR")}세대
                </span>
                <span className="rounded-full bg-success-soft px-3 py-1 text-xs font-extrabold text-success">
                  기준일 {complex.basisDate}
                </span>
              </div>
            </div>
            {detailed ? (
              <div className="w-full md:w-72">
                <WatchlistCTA complex={complex} mode="complex" />
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm font-extrabold text-primary">
                단지 보기
                <ArrowRight size={16} />
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            icon={<Home size={17} />}
            label="최근 실거래"
            value={formatKRWShort(complex.recentDealKRW)}
            helper={complex.recentDealDate}
          />
          <MetricCard
            icon={<Building2 size={17} />}
            label="평단가"
            value={formatKRWShort(complex.pyeongPriceKRW)}
            helper={`${formatAreaM2(complex.defaultAreaM2)} · ${formatPyeong(
              complex.defaultAreaM2,
            )}`}
          />
          <MetricCard
            icon={<CalendarDays size={17} />}
            label="6개월 거래량"
            value={`${complex.sixMonthTradeCount}건`}
            helper={`${complex.sixMonthChangePercent > 0 ? "+" : ""}${complex.sixMonthChangePercent}% 변동`}
          />
          <MetricCard
            icon={<Building2 size={17} />}
            label="전세가율"
            value={`${complex.jeonseRatioPercent}%`}
            helper="계약 조건별 별도 확인"
          />
        </div>
      </section>

      {detailed ? (
        <>
          <TrendChart points={complex.trend} />
          <ExternalListingLinks links={complex.externalLinks} />
          <section className="rounded-2xl bg-success-soft p-5 text-sm leading-7 text-text-subtle">
            <strong className="text-success">참고용 데이터입니다.</strong> 실거래 흐름은
            {` ${getBasisDateLabel(complex.basisDate)} `}검토용 데이터 기준이며,
            실제 매물 호가와 최신 거래는 외부 서비스에서 함께 확인하세요.
          </section>
          <Link
            className="focus-ring flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-accent px-5 text-base font-black text-white shadow-[var(--shadow-lifted)]"
            href={`/estimate?complexId=${complex.id}`}
          >
            이 단지로 매수 비용 계산하기
            <ArrowRight size={19} />
          </Link>
        </>
      ) : null}
    </article>
  );
}

function MetricCard({
  icon,
  label,
  value,
  helper,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  helper: string;
}): React.ReactElement {
  return (
    <div className="rounded-2xl bg-surface-muted p-4">
      <div className="mb-3 flex items-center gap-2 text-xs font-extrabold text-muted">
        {icon}
        {label}
      </div>
      <div className="text-xl font-black">{value}</div>
      <div className="mt-2 text-xs font-medium text-muted">{helper}</div>
    </div>
  );
}
