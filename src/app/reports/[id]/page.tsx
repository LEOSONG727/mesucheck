import { CostBreakdown } from "@/components/CostBreakdown";
import { ConfidenceLabel } from "@/components/ConfidenceLabel";
import { DisclaimerFooter } from "@/components/DisclaimerFooter";
import { ExpertQuestionList } from "@/components/ExpertQuestionList";
import { ExternalListingLinks } from "@/components/ExternalListingLinks";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { ReportActions } from "@/components/ReportActions";
import { ReportHero } from "@/components/ReportHero";
import { RiskBadge } from "@/components/RiskBadge";
import { WatchlistCTA } from "@/components/WatchlistCTA";
import { buildMockReport, getComplexById } from "@/data/mock-data";
import type { BuyerConditions, ConfidenceLabel as ConfidenceLabelType, TriState } from "@/types/maesucheck";

type ReportPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
};

export default async function ReportPage({
  searchParams,
}: ReportPageProps): Promise<React.ReactElement> {
  const sp = await searchParams;
  const conditions = parseConditions(sp);
  const report = buildMockReport(conditions);
  const complex = getComplexById(report.input.complexId);

  return (
    <section className="content-shell grid gap-5 py-7">
      <ReportHero report={report} />
      <div className="grid gap-5 lg:grid-cols-[1fr_340px] lg:items-start">
        <div className="grid gap-5">
          <CostBreakdown report={report} />

          <section>
            <div className="mb-3 text-xs font-extrabold uppercase tracking-[0.08em] text-muted">
              적용 가능 규제 배지
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {report.riskBadges.map((badge) => (
                <RiskBadge item={badge} key={badge.label} />
              ))}
            </div>
          </section>

          <CardGroup
            title="감면·예외 확인 항목"
            items={report.exemptionChecks}
          />
          <CardGroup title="대출 관련 주의사항" items={report.loanNotes} />
          <CardGroup title="양도세/종부세 참고 개념" items={report.conceptNotes} />
          <ExpertQuestionList questions={report.expertCheckQuestions} />
          <ExternalListingLinks links={report.externalLinks} />
          <ReportActions report={report} />
          <NewsletterSignup compact />
          <DisclaimerFooter
            basisDate={report.summary.basisDate}
            disclaimer={report.disclaimer}
          />
        </div>

        <aside className="grid gap-3 lg:sticky lg:top-24">
          <WatchlistCTA
            complex={complex}
            estimatedAdditionalCostKRW={report.summary.estimatedAdditionalCostKRW}
          />
          <div className="rounded-2xl border border-[var(--border)] bg-white p-4 text-sm leading-7 text-text-subtle shadow-[var(--shadow-soft)]">
            공유 링크와 PDF 저장은 준비 중입니다. 지금은 요약 복사와 관심단지
            저장을 사용할 수 있어요.
          </div>
        </aside>
      </div>
    </section>
  );
}

function CardGroup({
  title,
  items,
}: {
  title: string;
  items: {
    title: string;
    body: string;
    confidenceLabel: ConfidenceLabelType;
  }[];
}): React.ReactElement {
  return (
    <section>
      <div className="mb-3 text-xs font-extrabold uppercase tracking-[0.08em] text-muted">
        {title}
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {items.map((item) => (
          <article className="rounded-2xl border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-soft)]" key={item.title}>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <h3 className="text-base font-black">{item.title}</h3>
              <ConfidenceLabel value={item.confidenceLabel} />
            </div>
            <p className="mt-2 text-sm leading-7 text-text-subtle">{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function parseConditions(
  params: Record<string, string | undefined>,
): Partial<BuyerConditions> {
  const complexId = params.complexId ?? "terrapalace-gundae-2";
  const price = Number(params.price);
  const area = Number(params.area);
  const home = params.home;

  return {
    complexId,
    priceKRW: Number.isFinite(price) && price > 0 ? price : undefined,
    areaM2: Number.isFinite(area) && area > 0 ? area : undefined,
    homeCountAfterPurchase:
      home === "unknown"
        ? "unknown"
        : Number.isFinite(Number(home))
          ? Number(home)
          : undefined,
    isFirstHomeBuyer: parseBoolUnknown(params.first),
    isActualResidence: parseBoolUnknown(params.live),
    willUseLoan: parseBoolUnknown(params.loan),
    isTemporaryTwoHome: parseTriState(params.temp),
    willDisposeExistingHome: parseTriState(params.dispose),
  };
}

function parseBoolUnknown(value: string | undefined): boolean | "unknown" | undefined {
  if (value === "yes") {
    return true;
  }
  if (value === "no") {
    return false;
  }
  if (value === "unknown") {
    return "unknown";
  }
  return undefined;
}

function parseTriState(value: string | undefined): TriState | undefined {
  if (value === "yes" || value === "no" || value === "unknown") {
    return value;
  }
  return undefined;
}
