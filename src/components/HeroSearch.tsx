"use client";

import Link from "next/link";
import {
  ArrowRight,
  Building2,
  ChevronRight,
  FileCheck2,
  Landmark,
  Search,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { useMemo, useState } from "react";
import { StateView } from "@/components/StateView";
import { BASIS_DATE, exampleSearchTerms, searchComplexes } from "@/data/mock-data";
import { formatKRWShort } from "@/lib/formatters";
import type { Complex } from "@/types/maesucheck";

type HeroSearchProps = {
  initialQuery?: string;
};

export function HeroSearch({ initialQuery = "" }: HeroSearchProps): React.ReactElement {
  const [query, setQuery] = useState(initialQuery);
  const normalizedQuery = query.trim();
  const isErrorDemo = ["오류", "에러", "error"].includes(
    normalizedQuery.toLowerCase(),
  );
  const results = useMemo(() => searchComplexes(query), [query]);
  const primaryComplex = results[0];

  return (
    <section className="content-shell grid gap-8 py-8 lg:grid-cols-[minmax(0,1fr)_480px] lg:items-start lg:py-12">
      <div className="animate-fade-up pt-2 lg:pt-8">
        <div className="glass-panel mb-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-extrabold text-primary">
          <ShieldCheck size={15} />
          자양동 베타 · 기준일 {BASIS_DATE}
        </div>
        <h1 className="max-w-4xl text-balance text-4xl font-black leading-[1.12] text-foreground md:text-6xl">
          네이버에서 본 그 집,
          <br />
          내 상황으로 사도 괜찮은지
          <br />
          확인하세요
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-text-subtle md:text-lg">
          매물 탐색은 익숙한 서비스에서 하고, 매수 판단에 필요한 비용·세금·규제
          리스크는 내 조건 기준으로 한 번 더 확인합니다.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            className="focus-ring interactive-lift flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-primary px-5 text-sm font-black text-white shadow-[var(--shadow-lifted)]"
            href={primaryComplex ? `/estimate?complexId=${primaryComplex.id}` : "/estimate"}
          >
            내 상황으로 매수 리스크 확인하기
            <ArrowRight size={18} />
          </Link>
          <Link
            className="focus-ring interactive-lift flex min-h-12 items-center justify-center rounded-2xl border border-[var(--border-strong)] bg-white/82 px-5 text-sm font-bold text-text-subtle"
            href="/watchlist"
          >
            관심단지 보기
          </Link>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <HeroProof icon={<Landmark size={16} />} label="비용" value="매매가 외 필요액" />
          <HeroProof icon={<Building2 size={16} />} label="규제" value="지역·조건별 배지" />
          <HeroProof icon={<FileCheck2 size={16} />} label="근거" value="기준일·면책 포함" />
        </div>
      </div>

      <div className="premium-panel animate-fade-up overflow-hidden rounded-[28px] p-3">
        <div className="rounded-[22px] bg-primary-strong p-5 text-white">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-white/55">매수체크 리포트 시작</div>
              <h2 className="mt-1 text-2xl font-black">단지를 먼저 고르세요</h2>
            </div>
            <div className="flex size-11 items-center justify-center rounded-2xl bg-white/12">
              <Search size={20} />
            </div>
          </div>
          <div className="mt-5 flex min-h-13 items-center gap-3 rounded-2xl border border-white/12 bg-white px-4 text-foreground shadow-[var(--shadow-crisp)] focus-within:border-accent">
            <Search className="shrink-0 text-muted" size={18} />
            <input
              className="min-h-13 w-full bg-transparent text-base font-semibold outline-none placeholder:text-muted"
              id="complex-search"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="테라팰리스, 자양동, 더샵..."
              value={query}
            />
          </div>
        </div>

        <div className="px-2 py-4">
          <div className="mb-4 flex flex-wrap gap-2">
            {exampleSearchTerms.map((term) => (
              <button
                className="focus-ring rounded-full border border-[var(--border)] bg-white/78 px-3 py-2 text-sm font-bold text-text-subtle shadow-[var(--shadow-crisp)]"
                key={term}
                onClick={() => setQuery(term)}
                type="button"
              >
                {term}
              </button>
            ))}
          </div>

          {isErrorDemo ? (
            <StateView state="error" onRetry={() => setQuery("")} />
          ) : results.length === 0 ? (
            <StateView state="empty" />
          ) : (
            <div className="grid gap-2">
              {results.slice(0, 3).map((complex) => (
                <ComplexSearchResultRow complex={complex} key={complex.id} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function HeroProof({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}): React.ReactElement {
  return (
    <div className="glass-panel rounded-2xl p-4">
      <div className="mb-3 flex items-center gap-2 text-xs font-extrabold text-primary">
        {icon}
        {label}
      </div>
      <div className="text-sm font-bold text-text-subtle">{value}</div>
    </div>
  );
}

function ComplexSearchResultRow({
  complex,
}: {
  complex: Complex;
}): React.ReactElement {
  return (
    <Link
      className="focus-ring interactive-lift flex min-h-[92px] items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-white/86 px-4 py-3 shadow-[var(--shadow-soft)]"
      href={`/complexes/${complex.id}`}
    >
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="block truncate text-base font-black">
            {complex.name}
          </span>
          {complex.sixMonthChangePercent > 0 ? (
            <TrendingUp className="shrink-0 text-success" size={15} />
          ) : null}
        </span>
        <span className="mt-1 block truncate text-xs font-medium text-muted">
          서울 광진구 {complex.dong} · {complex.builtYear}년 ·{" "}
          {complex.householdCount.toLocaleString("ko-KR")}세대
        </span>
        <span className="mt-2 flex flex-wrap gap-1.5">
          {complex.zoneLabels.slice(0, 1).map((label) => (
            <span
              className="rounded-full bg-warning-soft px-2 py-1 text-[11px] font-extrabold text-warning"
              key={label}
            >
              {label}
            </span>
          ))}
          <span className="rounded-full bg-primary-soft px-2 py-1 text-[11px] font-extrabold text-primary">
            최근 {formatKRWShort(complex.recentDealKRW)}
          </span>
        </span>
      </span>
      <ChevronRight className="shrink-0 text-muted" size={18} />
    </Link>
  );
}
