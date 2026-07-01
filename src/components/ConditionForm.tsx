"use client";

import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ConditionSummary } from "@/components/ConditionSummary";
import { Button } from "@/components/ui/Button";
import { Surface } from "@/components/ui/Surface";
import { loadingMessages } from "@/data/ui-copy";
import { cn } from "@/lib/classnames";
import { formatAreaM2, formatKRWShort } from "@/lib/formatters";
import type { BuyerConditions, Complex, TriState } from "@/types/maesucheck";

type ConditionFormProps = {
  complex: Complex;
};

const reviewStep = 8;

export function ConditionForm({ complex }: ConditionFormProps): React.ReactElement {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [conditions, setConditions] = useState<BuyerConditions>({
    complexId: complex.id,
    priceKRW: complex.recentDealKRW,
    areaM2: complex.defaultAreaM2,
    homeCountAfterPurchase: 1,
    isActualResidence: true,
    isFirstHomeBuyer: "unknown",
    willUseLoan: true,
    isTemporaryTwoHome: "unknown",
    willDisposeExistingHome: "unknown",
  });
  const [loading, setLoading] = useState(false);
  const [loadingIndex, setLoadingIndex] = useState(0);

  useEffect(() => {
    if (!loading) {
      return;
    }

    const interval = setInterval(() => {
      setLoadingIndex((index) => (index + 1) % loadingMessages.length);
    }, 420);

    return () => clearInterval(interval);
  }, [loading]);

  function updateCondition(next: Partial<BuyerConditions>): void {
    setConditions((current) => ({ ...current, ...next }));
  }

  function goNext(): void {
    setStep((current) => Math.min(current + 1, reviewStep));
  }

  function goBack(): void {
    setStep((current) => Math.max(current - 1, 0));
  }

  function submit(): void {
    setLoading(true);
    window.localStorage.setItem(
      "maesucheck.lastConditions",
      JSON.stringify(conditions),
    );

    const params = new URLSearchParams({
      complexId: conditions.complexId,
      price: String(conditions.priceKRW),
      area: String(conditions.areaM2),
      home: String(conditions.homeCountAfterPurchase),
      first: toQueryValue(conditions.isFirstHomeBuyer),
      live: toQueryValue(conditions.isActualResidence),
      loan: toQueryValue(conditions.willUseLoan),
      temp: conditions.isTemporaryTwoHome,
      dispose: conditions.willDisposeExistingHome,
    });

    window.setTimeout(() => {
      router.push(`/reports/demo?${params.toString()}`);
    }, 1200);
  }

  if (loading) {
    return (
      <section className="content-shell grid min-h-[520px] place-items-center py-8">
        <Surface className="w-full max-w-xl" radius="xl" variant="premium">
          <div className="mb-4 flex items-center gap-3">
            <span className="size-2 rounded-full bg-accent" />
            <span className="text-sm font-extrabold text-text-subtle">
              {loadingMessages[loadingIndex]}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-surface-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${(loadingIndex + 1) * 25}%` }}
            />
          </div>
          <div className="mt-5 grid gap-3">
            <div className="skeleton h-20" />
            <div className="grid grid-cols-2 gap-3">
              <div className="skeleton h-24" />
              <div className="skeleton h-24" />
            </div>
          </div>
        </Surface>
      </section>
    );
  }

  const progressStep = Math.min(step + 1, reviewStep + 1);
  const progressPercent = (progressStep / (reviewStep + 1)) * 100;

  return (
    <section className="content-shell grid gap-6 py-8 lg:grid-cols-[minmax(0,700px)_360px] lg:items-start">
      <form
        className="grid min-h-[calc(100vh-128px)] gap-5 lg:min-h-0"
        onSubmit={(event) => {
          event.preventDefault();
          if (step === reviewStep) {
            submit();
            return;
          }
          goNext();
        }}
      >
        <Surface
          className="sticky top-[78px] z-20 -mx-4 rounded-none border-x-0 px-4 py-4 sm:mx-0 sm:rounded-[24px] sm:border"
          padding="none"
          variant="glass"
        >
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-extrabold text-muted">
                조건 입력
              </div>
              <h1 className="mt-1 text-xl font-black">
                {step === reviewStep ? "입력 조건을 확인하세요" : "한 가지씩 확인합니다"}
              </h1>
            </div>
            <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-extrabold text-primary">
              {progressStep} / {reviewStep + 1}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-surface-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </Surface>

        <Surface padding="lg" radius="xl" variant="premium">
          {renderStepContent(step, conditions, updateCondition, complex)}
        </Surface>

        <div className="sticky bottom-4 z-20 grid grid-cols-[auto_1fr] gap-3">
          <Button
            disabled={step === 0}
            leftIcon={<ArrowLeft size={17} />}
            onClick={goBack}
            size="lg"
            variant="secondary"
          >
            이전
          </Button>
          <Button
            rightIcon={<ArrowRight size={18} />}
            size="lg"
            type="submit"
            variant="accent"
          >
            {step === reviewStep ? "비용·리스크 리포트 보기" : "다음"}
          </Button>
        </div>
      </form>

      <aside className="hidden lg:sticky lg:top-24 lg:grid lg:gap-3">
        <Surface variant="premium">
          <div className="mb-3 text-xs font-extrabold text-muted">
            현재 조건
          </div>
          <ConditionSummary complex={complex} conditions={conditions} />
        </Surface>
        <Surface className="text-sm leading-7 text-text-subtle" variant="glass">
          모르는 항목은 그대로 선택해도 됩니다. 리포트에서는 해당 항목을 별도
          확인 또는 전문가 확인 필요로 표시합니다.
        </Surface>
      </aside>
    </section>
  );
}

function renderStepContent(
  step: number,
  conditions: BuyerConditions,
  updateCondition: (next: Partial<BuyerConditions>) => void,
  complex: Complex,
): React.ReactElement {
  if (step === 0) {
    return (
      <Question
        helper="호가가 아니라 실제 검토 중인 예상 매수가를 넣어주세요."
        title="매수 예상가가 얼마인가요?"
      >
        <Surface className="text-center" variant="muted">
          <label className="mb-2 block text-xs font-bold text-muted" htmlFor="price">
            억 원 단위
          </label>
          <input
            className="focus-ring w-40 rounded-2xl bg-white px-3 py-2 shadow-[var(--shadow-crisp)] text-right text-5xl font-black text-primary outline-none"
            id="price"
            max={200}
            min={1}
            onChange={(event) =>
              updateCondition({
                priceKRW: Number(event.target.value) * 100_000_000,
              })
            }
            step={0.1}
            type="number"
            value={conditions.priceKRW / 100_000_000}
          />
          <span className="ml-2 text-2xl font-black text-text-subtle">억</span>
          <div className="mt-3 text-sm font-bold text-warning">
            {formatKRWShort(conditions.priceKRW)} 기준
          </div>
        </Surface>
      </Question>
    );
  }

  if (step === 1) {
    return (
      <Question
        helper="85㎡ 초과 여부는 세금 항목에서 별도 확인 대상으로 표시될 수 있습니다."
        title="어떤 면적 타입을 생각하고 계세요?"
      >
        <div className="grid gap-2">
          {[59, 84.9, 114].map((area) => (
            <ChoiceButton
              active={conditions.areaM2 === area}
              key={area}
              label={`${formatAreaM2(area)}`}
              onClick={() => updateCondition({ areaM2: area })}
              subLabel={
                area > 85
                  ? "85㎡ 초과 · 농어촌특별세 확인 필요"
                  : "85㎡ 이하 · 일반적으로 별도 확인 부담이 적어요"
              }
            />
          ))}
        </div>
      </Question>
    );
  }

  if (step === 2) {
    return (
      <Question title="현재 보유 주택은 몇 채인가요?" helper="본인·배우자 합산 기준입니다.">
        <div className="grid gap-2">
          <ChoiceButton
            active={conditions.homeCountAfterPurchase === 1}
            label="없음 · 이 집이 첫 주택이에요"
            onClick={() => updateCondition({ homeCountAfterPurchase: 1 })}
            subLabel="1주택 기준으로 표시됩니다"
          />
          <ChoiceButton
            active={conditions.homeCountAfterPurchase === 2}
            label="1채 · 갈아타기 가능성이 있어요"
            onClick={() => updateCondition({ homeCountAfterPurchase: 2 })}
            subLabel="일시적 2주택 예외 확인 항목으로 표시됩니다"
          />
          <ChoiceButton
            active={conditions.homeCountAfterPurchase === "unknown"}
            label="잘 모르겠어요"
            onClick={() => updateCondition({ homeCountAfterPurchase: "unknown" })}
            subLabel="리포트에서 별도 확인으로 표시됩니다"
          />
        </div>
      </Question>
    );
  }

  if (step === 3) {
    return (
      <Question title="생애최초 주택 구입 조건에 해당하나요?">
        <TriStateChoices
          onChange={(value) =>
            updateCondition({
              isFirstHomeBuyer:
                value === "unknown" ? "unknown" : value === "yes",
            })
          }
          value={fromBooleanUnknown(conditions.isFirstHomeBuyer)}
        />
      </Question>
    );
  }

  if (step === 4) {
    return (
      <Question title="일시적 2주택 가능성이 있나요?">
        <TriStateChoices
          onChange={(value) => updateCondition({ isTemporaryTwoHome: value })}
          value={conditions.isTemporaryTwoHome}
        />
      </Question>
    );
  }

  if (step === 5) {
    return (
      <Question title="이 집에 직접 들어가 살 예정인가요?">
        <TriStateChoices
          onChange={(value) =>
            updateCondition({
              isActualResidence:
                value === "unknown" ? "unknown" : value === "yes",
            })
          }
          value={fromBooleanUnknown(conditions.isActualResidence)}
        />
      </Question>
    );
  }

  if (step === 6) {
    return (
      <Question title="대출을 받을 계획이 있나요?">
        <TriStateChoices
          onChange={(value) =>
            updateCondition({
              willUseLoan: value === "unknown" ? "unknown" : value === "yes",
            })
          }
          value={fromBooleanUnknown(conditions.willUseLoan)}
        />
      </Question>
    );
  }

  if (step === 7) {
    return (
      <Question title="기존 주택을 처분할 예정인가요?">
        <TriStateChoices
          onChange={(value) => updateCondition({ willDisposeExistingHome: value })}
          value={conditions.willDisposeExistingHome}
        />
      </Question>
    );
  }

  return (
    <Question
      helper="아래 조건 기준으로 참고 리포트를 만듭니다. 모르는 항목은 별도 확인으로 표시됩니다."
      title="입력한 조건을 확인하세요"
    >
      <div className="mb-5 rounded-2xl border border-[var(--border)] bg-surface-muted p-4">
        <ConditionSummary complex={complex} conditions={conditions} />
      </div>
      <div className="grid gap-3 text-sm leading-7 text-text-subtle">
        <ReviewRow label="단지" value={complex.name} />
        <ReviewRow label="매수가" value={formatKRWShort(conditions.priceKRW)} />
        <ReviewRow label="면적" value={formatAreaM2(conditions.areaM2)} />
        <ReviewRow
          label="보유 주택"
          value={
            conditions.homeCountAfterPurchase === "unknown"
              ? "잘 모르겠어요"
              : `${conditions.homeCountAfterPurchase}주택 기준`
          }
        />
      </div>
      <div className="mt-5 flex items-start gap-3 rounded-2xl bg-success-soft p-4 text-sm leading-7 text-text-subtle">
        <CheckCircle2 className="mt-0.5 shrink-0 text-success" size={18} />
        <p>
          결과는 입력 조건 기준의 참고 리포트입니다. 실제 세금과 규제 적용은
          세부 조건에 따라 달라질 수 있습니다.
        </p>
      </div>
    </Question>
  );
}

function Question({
  title,
  helper,
  children,
}: {
  title: string;
  helper?: string;
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <section>
      <h2 className="text-3xl font-black leading-tight md:text-4xl">
        {title}
      </h2>
      {helper ? (
        <p className="mt-3 max-w-lg text-sm leading-7 text-text-subtle">{helper}</p>
      ) : null}
      <div className="mt-7">{children}</div>
    </section>
  );
}

function ChoiceButton({
  active,
  label,
  subLabel,
  onClick,
}: {
  active: boolean;
  label: string;
  subLabel?: string;
  onClick: () => void;
}): React.ReactElement {
  return (
    <button
      className={cn(
        "focus-ring interactive-lift min-h-16 rounded-2xl border p-4 text-left",
        active
          ? "border-primary bg-primary-soft text-primary shadow-[var(--shadow-crisp)]"
          : "border-[var(--border)] bg-white/84 text-foreground hover:border-primary/40",
      )}
      onClick={onClick}
      type="button"
    >
      <span className="block text-base font-black">{label}</span>
      {subLabel ? (
        <span className="mt-1 block text-sm leading-6 text-text-subtle">
          {subLabel}
        </span>
      ) : null}
    </button>
  );
}

function TriStateChoices({
  value,
  onChange,
}: {
  value: TriState;
  onChange: (value: TriState) => void;
}): React.ReactElement {
  return (
    <div className="grid gap-2">
      <ChoiceButton active={value === "yes"} label="네" onClick={() => onChange("yes")} />
      <ChoiceButton active={value === "no"} label="아니요" onClick={() => onChange("no")} />
      <ChoiceButton
        active={value === "unknown"}
        label="잘 모르겠어요"
        onClick={() => onChange("unknown")}
        subLabel="리포트에서 별도 확인 또는 전문가 확인 필요로 표시됩니다"
      />
    </div>
  );
}

function ReviewRow({
  label,
  value,
}: {
  label: string;
  value: string;
}): React.ReactElement {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[var(--border)] pb-3 last:border-b-0 last:pb-0">
      <span className="font-bold text-muted">{label}</span>
      <span className="text-right font-black text-foreground">{value}</span>
    </div>
  );
}

function fromBooleanUnknown(value: boolean | "unknown"): TriState {
  if (value === "unknown") {
    return "unknown";
  }

  return value ? "yes" : "no";
}

function toQueryValue(value: boolean | "unknown"): string {
  if (value === "unknown") {
    return "unknown";
  }

  return value ? "yes" : "no";
}
