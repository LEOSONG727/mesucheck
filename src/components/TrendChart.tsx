"use client";

import { useMemo, useState } from "react";
import { formatKRWShort } from "@/lib/formatters";
import type { TrendPoint } from "@/types/maesucheck";

type TrendChartProps = {
  points: TrendPoint[];
};

export function TrendChart({ points }: TrendChartProps): React.ReactElement {
  const [activeIndex, setActiveIndex] = useState(points.length - 1);
  const activePoint = points[activeIndex] ?? points[points.length - 1];

  const chart = useMemo(() => {
    const width = 620;
    const height = 220;
    const prices = points.map((point) => point.pyeongPriceKRW);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const spread = Math.max(max - min, 1);

    return points.map((point, index) => {
      const x = 34 + (index * (width - 68)) / Math.max(points.length - 1, 1);
      const y = height - 34 - ((point.pyeongPriceKRW - min) / spread) * (height - 72);
      return { ...point, x, y };
    });
  }, [points]);

  const path = chart
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");
  const periodLabel = points.length
    ? `${points[0].month}–${points.at(-1)?.month}`
    : "거래 없음";

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 shadow-[var(--shadow-soft)]">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h3 className="text-base font-black">평단가 추이</h3>
          <p className="mt-1 text-xs text-muted">{periodLabel} · 원/평</p>
        </div>
        {activePoint ? (
          <div className="rounded-xl bg-primary-soft px-3 py-2 text-right">
            <div className="text-xs font-bold text-primary">{activePoint.month}</div>
            <div className="text-sm font-black text-primary">
              {formatKRWShort(activePoint.pyeongPriceKRW)}
            </div>
          </div>
        ) : null}
      </div>

      <div className="relative">
        {activePoint ? (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[calc(100%+10px)] rounded-xl bg-[#18181e] px-3 py-2 text-xs font-semibold leading-5 text-white shadow-xl"
            style={{
              left: `${((chart[activeIndex]?.x ?? 34) / 620) * 100}%`,
              top: `${((chart[activeIndex]?.y ?? 110) / 220) * 100}%`,
            }}
          >
            <div>{activePoint.month}</div>
            <div>평단가 {formatKRWShort(activePoint.pyeongPriceKRW)}</div>
            <div>거래 {activePoint.tradeCount}건</div>
          </div>
        ) : null}
        <svg
          className="h-[220px] w-full touch-pan-y overflow-visible"
          role="img"
          viewBox="0 0 620 220"
          aria-label="월별 평단가와 거래 건수 차트"
        >
          <path
            d="M34 186 H586"
            fill="none"
            stroke="rgba(0,0,0,.08)"
            strokeWidth="2"
          />
          <path
            d={path}
            fill="none"
            stroke="var(--primary)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4"
          />
          {chart.map((point, index) => {
            const isActive = index === activeIndex;

            return (
              <g key={point.month}>
                <rect
                  fill="transparent"
                  height="220"
                  onMouseEnter={() => setActiveIndex(index)}
                  onTouchStart={() => setActiveIndex(index)}
                  width="82"
                  x={point.x - 41}
                  y="0"
                />
                <circle
                  cx={point.x}
                  cy={point.y}
                  fill={isActive ? "var(--accent)" : "white"}
                  r={isActive ? 7 : 5}
                  stroke={isActive ? "var(--accent)" : "var(--primary)"}
                  strokeWidth="3"
                />
                <text
                  fill="var(--muted)"
                  fontSize="12"
                  fontWeight="700"
                  textAnchor="middle"
                  x={point.x}
                  y="210"
                >
                  {point.month.slice(5)}월
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <p className="mt-3 border-t border-[var(--border)] pt-3 text-sm leading-6 text-text-subtle">
        월별 동일 단지·유사 면적 거래의 평균 평단가입니다. 거래량이 적으면 개별
        거래가 평균에 미치는 영향이 클 수 있어요.
      </p>
    </div>
  );
}
