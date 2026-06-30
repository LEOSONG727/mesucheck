"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ConditionSummary } from "@/components/ConditionSummary";
import { loadingMessages } from "@/data/mock-data";
import { formatKRWShort } from "@/lib/formatters";
import type { BuyerConditions, Complex, TriState } from "@/types/maesucheck";

type ConditionFormProps = {
  complex: Complex;
};

export function ConditionForm({ complex }: ConditionFormProps): React.ReactElement {
  const router = useRouter();
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
    }, 560);

    return () => clearInterval(interval);
  }, [loading]);

  function updateCondition(next: Partial<BuyerConditions>): void {
    setConditions((current) => ({ ...current, ...next }));
  }

  function submit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
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
      first:
        conditions.isFirstHomeBuyer === "unknown"
          ? "unknown"
          : conditions.isFirstHomeBuyer
            ? "yes"
            : "no",
      live:
        conditions.isActualResidence === "unknown"
          ? "unknown"
          : conditions.isActualResidence
            ? "yes"
            : "no",
      loan:
        conditions.willUseLoan === "unknown"
          ? "unknown"
          : conditions.willUseLoan
            ? "yes"
            : "no",
      temp: conditions.isTemporaryTwoHome,
      dispose: conditions.willDisposeExistingHome,
    });

    window.setTimeout(() => {
      router.push(`/reports/demo?${params.toString()}`);
    }, 2200);
  }

  if (loading) {
    return (
      <section className="mobile-frame px-4 py-8">
        <div className="card p-5">
          <div className="mb-4 flex items-center gap-3">
            <span className="size-2 rounded-full bg-accent" />
            <span className="text-sm font-extrabold text-text-subtle">
              {loadingMessages[loadingIndex]}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-surface-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${(loadingIndex + 1) * 25}%` }}
            />
          </div>
          <div className="mt-5 grid gap-3">
            <div className="skeleton h-20" />
            <div className="grid grid-cols-2 gap-3">
              <div className="skeleton h-24" />
              <div className="skeleton h-24" />
            </div>
            <div className="skeleton h-32" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <form className="mobile-frame grid gap-5 px-4 py-7" onSubmit={submit}>
      <div className="sticky top-[68px] z-20 -mx-4 border-b border-[var(--border)] bg-white/94 px-4 py-4 backdrop-blur-xl">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-[0.08em] text-muted">
              조건 입력
            </div>
            <h1 className="mt-1 text-xl font-black tracking-[-0.03em]">
              내 상황을 알려주세요
            </h1>
          </div>
          <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-extrabold text-primary">
            기준일 2026.06.30
          </span>
        </div>
        <ConditionSummary complex={complex} conditions={conditions} />
      </div>

      <Question title="매수 예상가가 얼마인가요?" helper="mock 리포트는 입력 가격을 요약에 반영합니다.">
        <div className="rounded-2xl border border-[var(--border)] bg-white p-5 text-center">
          <label className="mb-2 block text-xs font-bold text-muted" htmlFor="price">
            억 원 단위
          </label>
          <input
            className="focus-ring w-40 rounded-xl bg-primary-soft px-3 py-2 text-right text-5xl font-black tracking-[-0.05em] text-primary outline-none"
            id="price"
            max={200}
            min={1}
            onChange={(event) =>
              updateCondition({ priceKRW: Number(event.target.value) * 100_000_000 })
            }
            step={0.1}
            type="number"
            value={conditions.priceKRW / 100_000_000}
          />
          <span className="ml-2 text-2xl font-black text-text-subtle">억</span>
          <div className="mt-3 text-sm font-bold text-warning">
            {formatKRWShort(conditions.priceKRW)} 기준
          </div>
        </div>
      </Question>

      <Question title="어떤 면적 타입을 생각하고 계세요?" helper="85㎡ 초과 여부는 별도 확인 항목에 영향을 줄 수 있어요.">
        <div className="grid gap-2">
          {[59, 84.9, 114].map((area) => (
            <ChoiceButton
              active={conditions.areaM2 === area}
              key={area}
              label={`${area}㎡`}
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

      <Question title="현재 보유 주택은 몇 채인가요?" helper="본인·배우자 합산 기준으로 생각해 주세요.">
        <div className="grid gap-2">
          <ChoiceButton
            active={conditions.homeCountAfterPurchase === 1}
            label="없음 · 이 집이 첫 주택이에요"
            onClick={() => updateCondition({ homeCountAfterPurchase: 1 })}
            subLabel="무주택 또는 1주택 기준으로 리포트에 표시돼요"
          />
          <ChoiceButton
            active={conditions.homeCountAfterPurchase === 2}
            label="1채 · 갈아타기 가능성이 있어요"
            onClick={() => updateCondition({ homeCountAfterPurchase: 2 })}
            subLabel="일시적 2주택 예외 확인 항목으로 표시돼요"
          />
          <ChoiceButton
            active={conditions.homeCountAfterPurchase === "unknown"}
            label="잘 모르겠어요"
            onClick={() => updateCondition({ homeCountAfterPurchase: "unknown" })}
            subLabel="리포트에서 별도 확인으로 표시돼요"
          />
        </div>
      </Question>

      <Question title="생애최초 주택 구입 조건에 해당하나요?">
        <TriStateChoices
          onChange={(value) =>
            updateCondition({
              isFirstHomeBuyer:
                value === "unknown" ? "unknown" : value === "yes",
            })
          }
          value={
            conditions.isFirstHomeBuyer === "unknown"
              ? "unknown"
              : conditions.isFirstHomeBuyer
                ? "yes"
                : "no"
          }
        />
      </Question>

      <Question title="일시적 2주택 가능성이 있나요?">
        <TriStateChoices
          onChange={(value) => updateCondition({ isTemporaryTwoHome: value })}
          value={conditions.isTemporaryTwoHome}
        />
      </Question>

      <Question title="이 집에 직접 들어가 살 예정인가요?">
        <TriStateChoices
          onChange={(value) =>
            updateCondition({
              isActualResidence:
                value === "unknown" ? "unknown" : value === "yes",
            })
          }
          value={
            conditions.isActualResidence === "unknown"
              ? "unknown"
              : conditions.isActualResidence
                ? "yes"
                : "no"
          }
        />
      </Question>

      <Question title="대출을 받을 계획이 있나요?">
        <TriStateChoices
          onChange={(value) =>
            updateCondition({
              willUseLoan: value === "unknown" ? "unknown" : value === "yes",
            })
          }
          value={
            conditions.willUseLoan === "unknown"
              ? "unknown"
              : conditions.willUseLoan
                ? "yes"
                : "no"
          }
        />
      </Question>

      <Question title="기존 주택을 처분할 예정인가요?">
        <TriStateChoices
          onChange={(value) => updateCondition({ willDisposeExistingHome: value })}
          value={conditions.willDisposeExistingHome}
        />
      </Question>

      <button
        className="focus-ring sticky bottom-4 min-h-14 rounded-2xl bg-accent px-5 text-base font-black text-white shadow-[var(--shadow-lifted)]"
        type="submit"
      >
        비용·리스크 리포트 보기
      </button>
    </form>
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
    <section className="card p-5">
      <h2 className="text-2xl font-black leading-tight tracking-[-0.04em]">
        {title}
      </h2>
      {helper ? <p className="mt-2 text-sm leading-6 text-text-subtle">{helper}</p> : null}
      <div className="mt-5">{children}</div>
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
      className={`focus-ring min-h-16 rounded-2xl border-2 p-4 text-left transition ${
        active
          ? "border-primary bg-primary-soft text-primary"
          : "border-[var(--border)] bg-white text-foreground hover:border-primary/40"
      }`}
      onClick={onClick}
      type="button"
    >
      <span className="block text-base font-black">{label}</span>
      {subLabel ? (
        <span className="mt-1 block text-sm leading-6 text-text-subtle">{subLabel}</span>
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
      <ChoiceButton
        active={value === "yes"}
        label="네"
        onClick={() => onChange("yes")}
      />
      <ChoiceButton
        active={value === "no"}
        label="아니요"
        onClick={() => onChange("no")}
      />
      <ChoiceButton
        active={value === "unknown"}
        label="잘 모르겠어요"
        onClick={() => onChange("unknown")}
        subLabel="리포트에서 별도 확인 또는 전문가 확인 필요로 표시돼요"
      />
    </div>
  );
}
