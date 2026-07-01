import { ExternalLink } from "lucide-react";
import { CollapsibleSection } from "@/components/CollapsibleSection";
import { ConfidenceLabel } from "@/components/ConfidenceLabel";
import { CostBreakdown } from "@/components/CostBreakdown";
import { DisclaimerFooter } from "@/components/DisclaimerFooter";
import { ExpertQuestionList } from "@/components/ExpertQuestionList";
import { ExternalListingLinks } from "@/components/ExternalListingLinks";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { ReportActions } from "@/components/ReportActions";
import { ReportHero } from "@/components/ReportHero";
import { RiskBadge } from "@/components/RiskBadge";
import { WatchlistCTA } from "@/components/WatchlistCTA";
import { ButtonLink } from "@/components/ui/Button";
import { Surface } from "@/components/ui/Surface";
import { buildMockReport, getComplexById } from "@/data/mock-data";
import { formatKRWShort } from "@/lib/formatters";
import type {
  BuyerConditions,
  CheckCard,
  ConfidenceLabel as ConfidenceLabelType,
  RiskBadgeItem,
  TriState,
} from "@/types/maesucheck";

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
  const naverLink = report.externalLinks.naverLand ?? "https://m.land.naver.com";

  return (
    <section className="content-shell grid gap-5 py-8">
      <ReportHero report={report} />
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <main className="grid gap-5">
          <RiskFocus items={report.riskBadges.slice(0, 3)} />
          <CostBreakdown report={report} />

          <CollapsibleSection
            description="규제, 감면, 대출 관련 항목을 필요할 때 펼쳐서 확인하세요."
            title="상세 확인 항목"
          >
            <div className="grid gap-6">
              <div>
                <SectionLabel>적용 가능 규제 배지</SectionLabel>
                <div className="grid gap-3 md:grid-cols-2">
                  {report.riskBadges.map((badge) => (
                    <RiskBadge item={badge} key={badge.label} />
                  ))}
                </div>
              </div>
              <InfoRows
                items={report.exemptionChecks.map(toInfoRow)}
                title="감면·예외 확인 항목"
              />
              <InfoRows
                items={report.loanNotes.map(toInfoRow)}
                title="대출 관련 주의사항"
              />
            </div>
          </CollapsibleSection>

          <CollapsibleSection
            description="정밀 계산이 아닌 참고 개념만 안내합니다."
            title="양도세/종부세 참고 개념"
          >
            <InfoRows items={report.conceptNotes.map(toInfoRow)} />
          </CollapsibleSection>

          <CollapsibleSection
            description="세무사, 법무사, 대출 상담사에게 바로 물어볼 수 있게 정리했습니다."
            title="전문가에게 물어볼 질문"
          >
            <ExpertQuestionList
              questions={report.expertCheckQuestions}
              showHeader={false}
            />
          </CollapsibleSection>

          <CollapsibleSection
            description="매물 데이터는 저장하지 않고 외부 서비스로 이동합니다."
            title="외부 매물 확인"
          >
            <ExternalListingLinks links={report.externalLinks} showIntro={false} />
          </CollapsibleSection>

          <NewsletterSignup compact />
          <DisclaimerFooter
            basisDate={report.summary.basisDate}
            disclaimer={report.disclaimer}
          />
        </main>

        <aside className="lg:sticky lg:top-24">
          <Surface as="div" className="grid gap-3" padding="sm" variant="premium">
            <div>
              <div className="text-xs font-extrabold text-muted">
                다음 행동
              </div>
              <p className="mt-2 text-sm leading-6 text-text-subtle">
                리포트는 참고용입니다. 실제 매물 확인과 전문가 확인을 분리해서
                진행하세요.
              </p>
            </div>

            <Surface className="grid gap-2" padding="sm" radius="md" variant="muted">
              <MiniMetric
                label="매매가 외 추가 비용"
                value={formatKRWShort(report.summary.estimatedAdditionalCostKRW)}
              />
              <MiniMetric
                label="총 예상 매입 비용"
                value={formatKRWShort(
                  report.summary.estimatedTotalAcquisitionCostKRW,
                )}
              />
            </Surface>

            <WatchlistCTA
              complex={complex}
              estimatedAdditionalCostKRW={report.summary.estimatedAdditionalCostKRW}
              mode="report"
            />

            <ButtonLink
              href={naverLink}
              rel="noopener noreferrer"
              rightIcon={<ExternalLink size={16} />}
              target="_blank"
              variant="secondary"
            >
              실제 매물 확인하기
            </ButtonLink>

            <ReportActions report={report} layout="stacked" />

            <p className="rounded-2xl bg-success-soft p-3 text-xs leading-6 text-text-subtle">
              공유 링크와 PDF 저장은 준비 중입니다. 지금은 요약 복사와 관심단지
              저장을 사용할 수 있어요.
            </p>
          </Surface>
        </aside>
      </div>
    </section>
  );
}

function RiskFocus({ items }: { items: RiskBadgeItem[] }): React.ReactElement {
  return (
    <section>
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <div className="text-xs font-extrabold text-muted">
            핵심 확인 3개
          </div>
          <h2 className="mt-1 text-xl font-black">먼저 볼 항목만 추렸습니다</h2>
        </div>
        <span className="hidden text-xs font-bold text-muted sm:block">
          상세 항목은 아래에서 펼쳐보기
        </span>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {items.map((item) => (
          <RiskBadge item={item} key={item.label} />
        ))}
      </div>
    </section>
  );
}

type InfoRow = {
  title: string;
  body: string;
  confidenceLabel: ConfidenceLabelType;
};

function InfoRows({
  title,
  items,
}: {
  title?: string;
  items: InfoRow[];
}): React.ReactElement {
  return (
    <div>
      {title ? <SectionLabel>{title}</SectionLabel> : null}
      <div className="divide-y divide-[var(--border)] rounded-2xl border border-[var(--border)] bg-white/62">
        {items.map((item) => (
          <article className="p-4" key={item.title}>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-black">{item.title}</h3>
              <ConfidenceLabel value={item.confidenceLabel} />
            </div>
            <p className="mt-2 text-sm leading-7 text-text-subtle">{item.body}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

function SectionLabel({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <div className="mb-3 text-xs font-extrabold text-muted">
      {children}
    </div>
  );
}

function MiniMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}): React.ReactElement {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs font-bold text-muted">{label}</span>
      <strong className="text-sm text-foreground">{value}</strong>
    </div>
  );
}

function toInfoRow(item: CheckCard): InfoRow {
  return {
    title: item.title,
    body: item.body,
    confidenceLabel: item.confidenceLabel,
  };
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
