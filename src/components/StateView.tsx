import Link from "next/link";
import { AlertCircle, Loader2, Search, Star } from "lucide-react";

type StateViewProps = {
  state: "loading" | "empty" | "error" | "watchlist-empty";
  title?: string;
  description?: string;
  helper?: string;
  onRetry?: () => void;
};

const defaults = {
  loading: {
    title: "최근 실거래가를 확인하는 중입니다",
    description: "규제지역 여부와 예상 비용을 함께 정리하고 있어요.",
  },
  empty: {
    title: "검색 결과를 찾지 못했어요.",
    description:
      "단지명이나 동 이름을 조금 다르게 입력해보세요. 현재는 자양동 주요 단지를 먼저 지원하고 있어요.",
  },
  error: {
    title: "정보를 불러오지 못했어요.",
    description:
      "일시적인 연결 문제일 수 있어요. 잠시 후 다시 시도해 주세요.",
  },
  "watchlist-empty": {
    title: "아직 저장한 단지가 없어요.",
    description:
      "관심 있는 단지를 저장하면 최근 실거래, 예상 비용, 규제 변경을 다시 확인하기 쉬워요.",
  },
} as const;

export function StateView({
  state,
  title,
  description,
  helper,
  onRetry,
}: StateViewProps): React.ReactElement {
  const copy = defaults[state];
  const icon =
    state === "loading" ? (
      <Loader2 className="animate-spin" size={30} />
    ) : state === "empty" ? (
      <Search size={30} />
    ) : state === "watchlist-empty" ? (
      <Star size={30} />
    ) : (
      <AlertCircle size={30} />
    );

  return (
    <section className="mx-auto flex min-h-[440px] w-full max-w-xl flex-col items-center justify-center px-6 py-14 text-center">
      <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-surface-muted text-muted">
        {icon}
      </div>
      <h2 className="text-xl font-black tracking-[-0.02em]">
        {title ?? copy.title}
      </h2>
      <p className="mt-3 max-w-md text-sm leading-7 text-text-subtle">
        {description ?? copy.description}
      </p>
      {helper ? <p className="mt-2 text-xs text-muted">{helper}</p> : null}

      {state === "empty" ? (
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {["자양동", "래미안", "더샵", "e편한세상", "아크로"].map((term) => (
            <Link
              className="focus-ring rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-bold text-text-subtle"
              href={`/?q=${encodeURIComponent(term)}`}
              key={term}
            >
              {term}
            </Link>
          ))}
        </div>
      ) : null}

      {state === "error" ? (
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          {onRetry ? (
            <button
              className="focus-ring min-h-11 rounded-xl bg-primary px-5 py-3 text-sm font-extrabold text-white"
              onClick={onRetry}
              type="button"
            >
              다시 시도
            </button>
          ) : (
            <Link
              className="focus-ring min-h-11 rounded-xl bg-primary px-5 py-3 text-sm font-extrabold text-white"
              href="/"
            >
              다시 시도
            </Link>
          )}
          <Link
            className="focus-ring min-h-11 rounded-xl border border-[var(--border-strong)] bg-white px-5 py-3 text-sm font-bold text-text-subtle"
            href="/"
          >
            홈으로 돌아가기
          </Link>
        </div>
      ) : null}

      {state === "watchlist-empty" ? (
        <Link
          className="focus-ring mt-7 min-h-11 rounded-xl bg-primary px-5 py-3 text-sm font-extrabold text-white"
          href="/"
        >
          매수 체크 시작하기
        </Link>
      ) : null}
    </section>
  );
}
