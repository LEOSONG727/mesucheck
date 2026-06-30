"use client";

import Link from "next/link";
import { BookmarkX, ExternalLink, RotateCcw } from "lucide-react";
import { useSyncExternalStore } from "react";
import { StateView } from "@/components/StateView";
import { useToast } from "@/components/ToastProvider";
import { formatKRWShort } from "@/lib/formatters";
import {
  getServerWatchlistSnapshot,
  getWatchlistSnapshot,
  parseWatchlistSnapshot,
  subscribeWatchlist,
  writeWatchlist,
} from "@/lib/watchlist";

export function WatchlistPageClient(): React.ReactElement {
  const watchlistSnapshot = useSyncExternalStore(
    subscribeWatchlist,
    getWatchlistSnapshot,
    getServerWatchlistSnapshot,
  );
  const items = parseWatchlistSnapshot(watchlistSnapshot);
  const { showToast } = useToast();

  function removeItem(complexId: string): void {
    const nextItems = items.filter((item) => item.complexId !== complexId);
    writeWatchlist(nextItems);
    showToast("관심단지에서 제거했어요.");
  }

  if (items.length === 0) {
    return <StateView state="watchlist-empty" />;
  }

  return (
    <section className="content-shell py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-black tracking-[-0.04em]">관심단지</h1>
        <p className="mt-2 text-sm leading-6 text-text-subtle">
          저장한 단지의 최근 실거래, 예상 비용, 규제 변경을 다시 확인하기 쉽게
          보관합니다.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <article className="card overflow-hidden" key={item.complexId}>
            <div className="border-b border-[var(--border)] p-5">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black tracking-[-0.03em]">
                    {item.complexName}
                  </h2>
                  <p className="mt-1 text-sm text-muted">서울 광진구 {item.dong}</p>
                </div>
                <button
                  className="focus-ring flex size-10 items-center justify-center rounded-full bg-accent-soft text-accent"
                  onClick={() => removeItem(item.complexId)}
                  type="button"
                  aria-label="관심단지 제거"
                >
                  <BookmarkX size={17} />
                </button>
              </div>
              <div className="mb-4 flex flex-wrap gap-2">
                {item.riskLabels.map((label) => (
                  <span
                    className="rounded-full bg-warning-soft px-3 py-1 text-xs font-extrabold text-warning"
                    key={label}
                  >
                    {label}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-surface-muted p-4">
                  <div className="text-xs font-bold text-muted">최근 실거래</div>
                  <div className="mt-2 text-lg font-black">
                    {formatKRWShort(item.recentDealKRW)}
                  </div>
                </div>
                <div className="rounded-xl bg-surface-muted p-4">
                  <div className="text-xs font-bold text-muted">예상 추가비용</div>
                  <div className="mt-2 text-lg font-black">
                    {item.estimatedAdditionalCostKRW
                      ? formatKRWShort(item.estimatedAdditionalCostKRW)
                      : "리포트 후 표시"}
                  </div>
                </div>
              </div>
            </div>
            <div className="grid gap-2 p-4 sm:grid-cols-3">
              <Link
                className="focus-ring flex min-h-11 items-center justify-center gap-1 rounded-xl bg-accent px-3 text-sm font-extrabold text-white"
                href={`/estimate?complexId=${item.complexId}`}
              >
                <RotateCcw size={15} />
                다시 계산
              </Link>
              <Link
                className="focus-ring flex min-h-11 items-center justify-center rounded-xl border border-[var(--border)] bg-white px-3 text-sm font-bold text-text-subtle"
                href={`/complexes/${item.complexId}`}
              >
                단지 보기
              </Link>
              <a
                className="focus-ring flex min-h-11 items-center justify-center gap-1 rounded-xl border border-[var(--border)] bg-white px-3 text-sm font-bold text-text-subtle"
                href="https://m.land.naver.com"
                rel="noopener noreferrer"
                target="_blank"
              >
                매물
                <ExternalLink size={14} />
              </a>
            </div>
          </article>
        ))}
      </div>
      <div className="mt-5 rounded-2xl border border-success/15 bg-success-soft p-5 text-sm leading-7 text-text-subtle">
        <strong className="text-success">규제·세금 변경 알림은 준비 중입니다.</strong>{" "}
        지금은 이 브라우저에만 저장되며, 실제 알림과 계정 저장은 다음 단계에서
        확장할 예정입니다.
      </div>
    </section>
  );
}
