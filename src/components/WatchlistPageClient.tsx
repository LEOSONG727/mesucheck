"use client";

import { BookmarkX, ExternalLink, RotateCcw } from "lucide-react";
import { useSyncExternalStore } from "react";
import { StateView } from "@/components/StateView";
import { useToast } from "@/components/ToastProvider";
import { Badge } from "@/components/ui/Badge";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Surface } from "@/components/ui/Surface";
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
        <h1 className="text-3xl font-black">관심단지</h1>
        <p className="mt-2 text-sm leading-6 text-text-subtle">
          저장한 단지의 최근 실거래, 예상 비용, 규제 변경을 다시 확인하기 쉽게
          보관합니다.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <Surface
            as="article"
            className="overflow-hidden"
            key={item.complexId}
            padding="none"
          >
            <div className="border-b border-[var(--border)] p-5">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black">
                    {item.complexName}
                  </h2>
                  <p className="mt-1 text-sm text-muted">서울 광진구 {item.dong}</p>
                </div>
                <Button
                  aria-label="관심단지 제거"
                  onClick={() => removeItem(item.complexId)}
                  size="icon"
                  variant="soft"
                >
                  <BookmarkX size={17} />
                </Button>
              </div>
              <div className="mb-4 flex flex-wrap gap-2">
                {item.riskLabels.map((label) => (
                  <Badge key={label} variant="warning">
                    {label}
                  </Badge>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Surface padding="sm" radius="md" variant="muted">
                  <div className="text-xs font-bold text-muted">최근 실거래</div>
                  <div className="mt-2 text-lg font-black">
                    {formatKRWShort(item.recentDealKRW)}
                  </div>
                </Surface>
                <Surface padding="sm" radius="md" variant="muted">
                  <div className="text-xs font-bold text-muted">예상 추가비용</div>
                  <div className="mt-2 text-lg font-black">
                    {item.estimatedAdditionalCostKRW
                      ? formatKRWShort(item.estimatedAdditionalCostKRW)
                      : "리포트 후 표시"}
                  </div>
                </Surface>
              </div>
            </div>
            <div className="grid gap-2 p-4 sm:grid-cols-3">
              <ButtonLink
                href={`/estimate?complexId=${item.complexId}`}
                leftIcon={<RotateCcw size={15} />}
                variant="accent"
              >
                다시 계산
              </ButtonLink>
              <ButtonLink href={`/complexes/${item.complexId}`} variant="ghost">
                단지 보기
              </ButtonLink>
              <ButtonLink
                href="https://m.land.naver.com"
                rel="noopener noreferrer"
                rightIcon={<ExternalLink size={14} />}
                target="_blank"
                variant="ghost"
              >
                매물
              </ButtonLink>
            </div>
          </Surface>
        ))}
      </div>
      <Surface className="mt-5 text-sm leading-7 text-text-subtle" variant="muted">
        <strong className="text-success">규제·세금 변경 알림은 준비 중입니다.</strong>{" "}
        지금은 이 브라우저에만 저장되며, 실제 알림과 계정 저장은 다음 단계에서
        확장할 예정입니다.
      </Surface>
    </section>
  );
}
