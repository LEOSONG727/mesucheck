"use client";

import { Bookmark } from "lucide-react";
import { useSyncExternalStore } from "react";
import { useToast } from "@/components/ToastProvider";
import {
  getServerWatchlistSnapshot,
  getWatchlistSnapshot,
  parseWatchlistSnapshot,
  subscribeWatchlist,
  writeWatchlist,
} from "@/lib/watchlist";
import type { Complex, WatchlistItem } from "@/types/maesucheck";

type WatchlistCTAProps = {
  complex: Complex;
  estimatedAdditionalCostKRW?: number;
  mode?: "complex" | "report";
};

export function WatchlistCTA({
  complex,
  estimatedAdditionalCostKRW,
  mode = "complex",
}: WatchlistCTAProps): React.ReactElement {
  const watchlistSnapshot = useSyncExternalStore(
    subscribeWatchlist,
    getWatchlistSnapshot,
    getServerWatchlistSnapshot,
  );
  const items = parseWatchlistSnapshot(watchlistSnapshot);
  const saved = items.some((item) => item.complexId === complex.id);
  const { showToast } = useToast();

  function toggleSaved(): void {
    if (saved) {
      writeWatchlist(items.filter((item) => item.complexId !== complex.id));
      showToast("관심단지에서 제거했어요.");
      return;
    }

    const nextItem: WatchlistItem = {
      complexId: complex.id,
      complexName: complex.name,
      dong: complex.dong,
      savedAt: new Date().toISOString(),
      recentDealKRW: complex.recentDealKRW,
      estimatedAdditionalCostKRW,
      riskLabels: complex.zoneLabels,
    };

    writeWatchlist([
      nextItem,
      ...items.filter((item) => item.complexId !== complex.id),
    ]);
    showToast("관심단지에 저장했어요. 다음에 다시 확인하기 쉽게 보관됩니다.");
  }

  const label = saved
    ? "관심단지에 저장됨"
    : mode === "report"
      ? "이 조건으로 관심단지 저장하기"
      : "이 단지 저장하고 나중에 다시 보기";

  return (
    <button
      className={`focus-ring flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border-2 px-4 text-sm font-extrabold transition ${
        saved
          ? "border-primary bg-primary-soft text-primary"
          : "border-[var(--border-strong)] bg-white text-text-subtle hover:border-primary hover:text-primary"
      }`}
      onClick={toggleSaved}
      type="button"
    >
      <Bookmark size={17} fill={saved ? "currentColor" : "none"} />
      {label}
    </button>
  );
}
