"use client";

import Link from "next/link";
import { ArrowRight, ChevronRight, Search, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { StateView } from "@/components/StateView";
import { exampleSearchTerms, searchComplexes } from "@/data/mock-data";
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
    <section className="content-shell grid gap-8 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:py-12">
      <div className="animate-fade-up pt-4 lg:pt-10">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-info-soft px-4 py-2 text-sm font-extrabold text-info">
          <ShieldCheck size={15} />
          매수 전 리스크 체크
        </div>
        <h1 className="max-w-3xl text-balance text-4xl font-black leading-[1.18] text-foreground md:text-6xl">
          네이버에서 본 그 집,
          <br />
          <span className="text-primary">내 상황으로 사도 괜찮은지</span>
          <br />
          확인하세요
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-text-subtle md:text-lg">
          실거래가와 세금·규제 기준을 바탕으로, 매매가 외 추가 비용과 계약 전
          확인할 리스크를 쉽게 정리해드립니다.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            className="focus-ring flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-black text-white shadow-[var(--shadow-lifted)]"
            href={primaryComplex ? `/estimate?complexId=${primaryComplex.id}` : "/estimate"}
          >
            내 상황으로 매수 리스크 확인하기
            <ArrowRight size={18} />
          </Link>
          <Link
            className="focus-ring flex min-h-12 items-center justify-center rounded-xl border border-[var(--border-strong)] bg-white px-5 text-sm font-bold text-text-subtle"
            href="/watchlist"
          >
            관심단지 보기
          </Link>
        </div>
      </div>

      <div className="card animate-fade-up overflow-hidden p-5 shadow-[var(--shadow-lifted)]">
        <label
          className="mb-3 block text-xs font-extrabold uppercase tracking-[0.08em] text-muted"
          htmlFor="complex-search"
        >
          단지 또는 동 이름으로 검색
        </label>
        <div className="flex min-h-13 items-center gap-3 rounded-xl border border-transparent bg-surface-muted px-4 focus-within:border-primary">
          <Search className="shrink-0 text-muted" size={18} />
          <input
            className="min-h-13 w-full bg-transparent text-base font-semibold outline-none placeholder:text-muted"
            id="complex-search"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="테라팰리스, 자양동, 더샵..."
            value={query}
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {exampleSearchTerms.map((term) => (
            <button
              className="focus-ring rounded-full border border-[var(--border)] bg-white px-3 py-2 text-sm font-bold text-text-subtle"
              key={term}
              onClick={() => setQuery(term)}
              type="button"
            >
              {term}
            </button>
          ))}
        </div>

        <div className="mt-5">
          {isErrorDemo ? (
            <StateView state="error" onRetry={() => setQuery("")} />
          ) : results.length === 0 ? (
            <StateView state="empty" />
          ) : (
            <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-white">
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

function ComplexSearchResultRow({
  complex,
}: {
  complex: Complex;
}): React.ReactElement {
  return (
    <Link
      className="focus-ring flex min-h-[88px] items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-3 last:border-b-0 hover:bg-surface-muted"
      href={`/complexes/${complex.id}`}
    >
      <span className="min-w-0 flex-1">
        <span className="block truncate text-base font-black">
          {complex.name}
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
