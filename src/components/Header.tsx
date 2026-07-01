"use client";

import Link from "next/link";
import { Bookmark, Home, Newspaper, ShieldCheck } from "lucide-react";
import { useSyncExternalStore } from "react";
import { Badge } from "@/components/ui/Badge";
import { buttonClassName, ButtonLink } from "@/components/ui/Button";
import { Surface } from "@/components/ui/Surface";
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
        <Surface
          className="pointer-events-auto flex h-[58px] items-center justify-between gap-3 px-3"
          padding="none"
          radius="lg"
          variant="glass"
        >
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
            <Badge
              className="hidden sm:inline-flex"
              icon={<ShieldCheck size={14} />}
              variant="success"
            >
              검토용 기준
            </Badge>
            <ButtonLink
              className="hidden md:inline-flex"
              href="/newsletter"
              leftIcon={<Newspaper size={16} />}
              size="sm"
              variant="ghost"
            >
              뉴스레터
            </ButtonLink>
            <Link
              className={buttonClassName({
                className: "relative text-primary",
                size: "icon",
                variant: "ghost",
              })}
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
        </Surface>
      </div>
    </header>
  );
}
