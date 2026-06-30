"use client";

import Link from "next/link";
import { Bookmark, Home, Newspaper, ShieldCheck } from "lucide-react";
import { useSyncExternalStore } from "react";
import {
  getServerWatchlistSnapshot,
  getWatchlistSnapshot,
  parseWatchlistSnapshot,
  subscribeWatchlist,
} from "@/lib/watchlist";

export function Header(): React.ReactElement {
  const watchlistSnapshot = useSyncExternalStore(
    subscribeWatchlist,
    getWatchlistSnapshot,
    getServerWatchlistSnapshot,
  );
  const savedCount = parseWatchlistSnapshot(watchlistSnapshot).length;

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-[var(--border)] bg-white/92 backdrop-blur-xl">
      <div className="content-shell flex h-[68px] items-center justify-between gap-4">
        <Link className="focus-ring flex min-w-0 items-center gap-3 rounded-lg" href="/">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
            <Home size={19} strokeWidth={2.4} />
          </span>
          <span className="min-w-0">
            <span className="block text-lg font-black tracking-[-0.02em] text-primary">
              매수체크
            </span>
            <span className="hidden text-xs font-medium text-muted sm:block">
              부동산 매수 전 리스크 체크
            </span>
          </span>
        </Link>

        <nav className="flex items-center gap-2" aria-label="주요 메뉴">
          <Link
            className="focus-ring hidden items-center gap-2 rounded-full bg-success-soft px-3 py-2 text-xs font-bold text-success sm:flex"
            href="/newsletter"
          >
            <ShieldCheck size={14} />
            국토부 기준 · 참고용
          </Link>
          <Link
            className="focus-ring hidden h-10 items-center gap-2 rounded-full border border-[var(--border)] bg-white px-4 text-sm font-bold text-text-subtle md:flex"
            href="/newsletter"
          >
            <Newspaper size={16} />
            뉴스레터
          </Link>
          <Link
            className="focus-ring relative flex size-10 items-center justify-center rounded-full border border-[var(--border)] bg-white text-primary"
            href="/watchlist"
            aria-label="관심단지 보기"
          >
            <Bookmark size={19} fill={savedCount > 0 ? "currentColor" : "none"} />
            {savedCount > 0 ? (
              <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-accent text-[10px] font-black text-white">
                {savedCount}
              </span>
            ) : null}
          </Link>
        </nav>
      </div>
    </header>
  );
}
