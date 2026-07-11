import { ArrowRight, Building2, CalendarDays, Home, MapPin } from "lucide-react";
import { ExternalListingLinks } from "@/components/ExternalListingLinks";
import { TrendChart } from "@/components/TrendChart";
import { WatchlistCTA } from "@/components/WatchlistCTA";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Surface } from "@/components/ui/Surface";
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
      <Surface as="section" className="overflow-hidden" padding="none">
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
                  <Badge key={label} variant="warning">
                    {label}
                  </Badge>
                ))}
                <Badge variant="neutral">
                  {complex.builtYear}년 · {complex.householdCount.toLocaleString("ko-KR")}세대
                </Badge>
                <Badge variant="success">
                  기준일 {complex.basisDate}
                </Badge>
                <Badge
                  variant={complex.marketSnapshot?.status === "ok" ? "success" : "neutral"}
                >
                  {complex.marketSnapshot?.status === "ok"
                    ? "국토부 실거래가"
                    : "검토용 데이터"}
                </Badge>
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
      </Surface>

      {detailed ? (
        <>
          {complex.marketSnapshot ? (
            <Surface as="section" padding="md" variant="muted">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-black">공공데이터 조회 상태</h2>
                  <p className="mt-2 text-sm leading-6 text-text-subtle">
                    {complex.marketSnapshot.message}
                  </p>
                </div>
                <Badge
                  variant={complex.marketSnapshot.status === "ok" ? "success" : "warning"}
                >
                  {complex.marketSnapshot.status === "ok"
                    ? `매매 ${complex.marketSnapshot.tradeCount}건 · 전세 ${complex.marketSnapshot.rentCount}건`
                    : "기존 검토용 값 유지"}
                </Badge>
              </div>
              {complex.marketSnapshot.status === "ok" ? (
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <MarketValue
                    label="유사면적 매매 중앙값"
                    value={formatKRWShort(complex.marketSnapshot.medianTradePriceKRW ?? 0)}
                  />
                  <MarketValue
                    label="최저–최고"
                    value={`${formatKRWShort(complex.marketSnapshot.minTradePriceKRW ?? 0)}–${formatKRWShort(complex.marketSnapshot.maxTradePriceKRW ?? 0)}`}
                  />
                  <MarketValue
                    label="조회 면적"
                    value={`${complex.defaultAreaM2}㎡ ±3㎡`}
                  />
                </div>
              ) : null}
            </Surface>
          ) : null}
          <TrendChart points={complex.trend} />
          <ExternalListingLinks links={complex.externalLinks} />
          <Surface
            as="section"
            className="text-sm leading-7 text-text-subtle"
            variant="muted"
          >
            <strong className="text-success">
              {complex.marketSnapshot?.status === "ok"
                ? "국토교통부 공개자료입니다."
                : "참고용 데이터입니다."}
            </strong>{" "}
            실거래 흐름은 {getBasisDateLabel(complex.basisDate)} 기준이며, 신고 취소·정정
            및 최신 매물 호가는 외부 서비스에서도 함께 확인하세요.
          </Surface>
          <ButtonLink
            href={`/estimate?complexId=${complex.id}`}
            rightIcon={<ArrowRight size={19} />}
            size="lg"
            variant="accent"
          >
            이 단지로 매수 비용 계산하기
          </ButtonLink>
        </>
      ) : null}
    </article>
  );
}

function MarketValue({ label, value }: { label: string; value: string }): React.ReactElement {
  return (
    <div className="rounded-xl bg-white p-3">
      <div className="text-xs font-bold text-muted">{label}</div>
      <div className="mt-1 text-base font-black">{value}</div>
    </div>
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
    <Surface padding="sm" radius="md" variant="muted">
      <div className="mb-3 flex items-center gap-2 text-xs font-extrabold text-muted">
        {icon}
        {label}
      </div>
      <div className="text-xl font-black">{value}</div>
      <div className="mt-2 text-xs font-medium text-muted">{helper}</div>
    </Surface>
  );
}
