import { ExternalLink } from "lucide-react";
import type { ExternalLinks } from "@/types/maesucheck";

type ExternalListingLinksProps = {
  links: ExternalLinks;
};

const items = [
  {
    key: "naverLand",
    title: "실제 매물 호가 확인하기",
    source: "네이버부동산",
    description: "호가와 리포트 비용을 함께 비교해 보세요.",
  },
  {
    key: "hogangnono",
    title: "최근 거래 흐름 더 보기",
    source: "호갱노노",
    description: "단지 거래와 지역 흐름을 외부 서비스에서 확인하세요.",
  },
  {
    key: "zigbang",
    title: "주변 후보 매물 보기",
    source: "직방",
    description: "주변 후보를 넓게 살펴볼 때 활용하세요.",
  },
] as const;

export function ExternalListingLinks({
  links,
}: ExternalListingLinksProps): React.ReactElement {
  return (
    <section>
      <div className="mb-2 text-xs font-extrabold uppercase tracking-[0.08em] text-muted">
        실제 매물은 익숙한 서비스에서 확인하세요
      </div>
      <p className="mb-3 text-sm leading-6 text-text-subtle">
        이 리포트는 매수 판단을 돕는 참고 자료입니다. 실제 호가와 매물 상태는
        외부 서비스에서 함께 확인하세요.
      </p>
      <div className="grid gap-2">
        {items.map((item) => {
          const href = links[item.key];

          return (
            <a
              className="focus-ring flex min-h-[76px] items-center justify-between gap-4 rounded-xl border border-[var(--border)] bg-white p-4 shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-lifted)]"
              href={href}
              key={item.key}
              rel="noopener noreferrer"
              target="_blank"
            >
              <span>
                <span className="block text-sm font-extrabold">
                  {item.title} — {item.source}
                </span>
                <span className="mt-1 block text-xs leading-5 text-muted">
                  {item.description}
                </span>
              </span>
              <ExternalLink className="shrink-0 text-muted" size={18} />
            </a>
          );
        })}
      </div>
    </section>
  );
}
