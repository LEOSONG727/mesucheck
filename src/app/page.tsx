import { Calculator, FileText, SearchCheck, ShieldCheck } from "lucide-react";
import { HeroSearch } from "@/components/HeroSearch";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { Surface } from "@/components/ui/Surface";

type HomePageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function HomePage({
  searchParams,
}: HomePageProps): Promise<React.ReactElement> {
  const { q = "" } = await searchParams;

  return (
    <>
      <HeroSearch initialQuery={q} />
      <section className="content-shell grid-flow-dense grid gap-4 py-8 md:grid-cols-3">
        <StepCard
          icon={<SearchCheck size={22} />}
          title="단지를 검색해요"
          body="현재는 서울 광진구 자양동 주요 단지를 먼저 지원합니다."
        />
        <StepCard
          icon={<Calculator size={22} />}
          title="내 상황을 입력해요"
          body="보유 주택, 생애최초, 실거주, 대출 계획을 잘 모르겠어요 선택지와 함께 입력합니다."
        />
        <StepCard
          icon={<FileText size={22} />}
          title="리포트를 확인해요"
          body="예상 추가 비용, 규제 배지, 근거, 전문가 질문과 면책 문구를 함께 봅니다."
        />
      </section>
      <section className="content-shell py-4">
        <Surface padding="lg" variant="glass">
          <div className="flex gap-3">
            <ShieldCheck className="mt-0.5 shrink-0 text-success" size={22} />
            <div>
              <h2 className="text-base font-black text-success">참고용 정보 안내</h2>
              <p className="mt-2 text-sm leading-7 text-text-subtle">
                모든 결과에는 기준일, 근거, 신뢰 라벨, 면책 문구를 포함합니다.
                초기 데이터는 검토용이며 최종 결정 전에는 세무사·공인중개사·법무사와
                함께 확인하는 것이 안전합니다.
              </p>
            </div>
          </div>
        </Surface>
      </section>
      <section className="content-shell py-6 pb-14">
        <NewsletterSignup />
      </section>
    </>
  );
}

function StepCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}): React.ReactElement {
  return (
    <Surface as="article" interactive variant="premium">
      <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-primary-soft text-primary shadow-[var(--shadow-crisp)]">
        {icon}
      </div>
      <h2 className="text-lg font-black">{title}</h2>
      <p className="mt-2 text-sm leading-7 text-text-subtle">{body}</p>
    </Surface>
  );
}
