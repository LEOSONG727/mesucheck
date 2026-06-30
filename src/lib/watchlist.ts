import type { WatchlistItem } from "@/types/maesucheck";

export const WATCHLIST_KEY = "maesucheck.watchlist";
const WATCHLIST_EVENT = "maesucheck:watchlist";
const EMPTY_SNAPSHOT = "[]";

export function readWatchlist(): WatchlistItem[] {
  return parseWatchlistSnapshot(getWatchlistSnapshot());
}

export function getWatchlistSnapshot(): string {
  if (typeof window === "undefined") {
    return EMPTY_SNAPSHOT;
  }

  return window.localStorage.getItem(WATCHLIST_KEY) ?? EMPTY_SNAPSHOT;
}

export function getServerWatchlistSnapshot(): string {
  return EMPTY_SNAPSHOT;
}

export function parseWatchlistSnapshot(snapshot: string): WatchlistItem[] {
  if (!snapshot) {
    return [];
  }

  try {
    return JSON.parse(snapshot) as WatchlistItem[];
  } catch {
    return [];
  }
}

export function writeWatchlist(items: WatchlistItem[]): void {
  window.localStorage.setItem(WATCHLIST_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(WATCHLIST_EVENT));
}

export function subscribeWatchlist(callback: () => void): () => void {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  window.addEventListener("storage", callback);
  window.addEventListener(WATCHLIST_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(WATCHLIST_EVENT, callback);
  };
}
