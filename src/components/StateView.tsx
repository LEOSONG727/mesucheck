import { AlertCircle, Loader2, Search, Star } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/Button";

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
      "시·군·구와 법정동 주소를 조금 다르게 입력하거나 최근 실거래가 있는 다른 지역을 찾아보세요.",
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
      <h2 className="text-xl font-black">
        {title ?? copy.title}
      </h2>
      <p className="mt-3 max-w-md text-sm leading-7 text-text-subtle">
        {description ?? copy.description}
      </p>
      {helper ? <p className="mt-2 text-xs text-muted">{helper}</p> : null}

      {state === "empty" ? (
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {["서울 광진구 자양동", "서울 강남구 대치동", "서울 송파구 잠실동"].map((term) => (
            <ButtonLink
              href={`/?q=${encodeURIComponent(term)}`}
              key={term}
              size="sm"
              variant="ghost"
            >
              {term}
            </ButtonLink>
          ))}
        </div>
      ) : null}

      {state === "error" ? (
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          {onRetry ? (
            <Button onClick={onRetry}>
              다시 시도
            </Button>
          ) : (
            <ButtonLink href="/">
              다시 시도
            </ButtonLink>
          )}
          <ButtonLink href="/" variant="secondary">
            홈으로 돌아가기
          </ButtonLink>
        </div>
      ) : null}

      {state === "watchlist-empty" ? (
        <ButtonLink className="mt-7" href="/">
          매수 체크 시작하기
        </ButtonLink>
      ) : null}
    </section>
  );
}
