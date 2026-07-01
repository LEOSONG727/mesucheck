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
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40">
      <div className="content-shell pt-3">
        <div className="glass-panel pointer-events-auto flex h-[58px] items-center justify-between gap-3 rounded-[20px] px-3">
          <Link
            className="focus-ring flex min-w-0 items-center gap-3 rounded-2xl px-1"
            href="/"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary-strong text-white shadow-[var(--shadow-crisp)]">
              <Home size={19} strokeWidth={2.4} />
            </span>
            <span className="min-w-0">
              <span className="block text-lg font-black text-primary">
                매수체크
              </span>
              <span className="hidden text-xs font-medium text-muted sm:block">
                매수 전 리스크 리포트
              </span>
            </span>
          </Link>

          <nav className="flex items-center gap-2" aria-label="주요 메뉴">
            <Link
              className="focus-ring hidden items-center gap-2 rounded-full bg-white/72 px-3 py-2 text-xs font-bold text-success shadow-[var(--shadow-crisp)] sm:flex"
              href="/newsletter"
            >
              <ShieldCheck size={14} />
              검토용 기준
            </Link>
            <Link
              className="focus-ring hidden h-10 items-center gap-2 rounded-full border border-[var(--border)] bg-white/72 px-4 text-sm font-bold text-text-subtle md:flex"
              href="/newsletter"
            >
              <Newspaper size={16} />
              뉴스레터
            </Link>
            <Link
              className="focus-ring relative flex size-10 items-center justify-center rounded-full border border-[var(--border)] bg-white/82 text-primary shadow-[var(--shadow-crisp)]"
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
      </div>
    </header>
  );
}
