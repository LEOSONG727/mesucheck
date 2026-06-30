import { formatAreaM2, formatKRWShort } from "@/lib/formatters";
import type { BuyerConditions, Complex } from "@/types/maesucheck";

type ConditionSummaryProps = {
  complex: Complex;
  conditions: BuyerConditions;
};

export function ConditionSummary({
  complex,
  conditions,
}: ConditionSummaryProps): React.ReactElement {
  const items = [
    complex.name,
    formatKRWShort(conditions.priceKRW),
    formatAreaM2(conditions.areaM2),
    conditions.homeCountAfterPurchase === "unknown"
      ? "주택 수 별도 확인"
      : `${conditions.homeCountAfterPurchase}주택 기준`,
    conditions.isFirstHomeBuyer === "unknown"
      ? "생애최초 잘 모르겠어요"
      : conditions.isFirstHomeBuyer
        ? "생애최초 가능성"
        : "생애최초 아님",
    conditions.willUseLoan === "unknown"
      ? "대출 계획 별도 확인"
      : conditions.willUseLoan
        ? "대출 예정"
        : "대출 미예정",
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          className="rounded-full border border-[var(--border)] bg-white px-3 py-1.5 text-xs font-bold text-text-subtle"
          key={item}
        >
          {item}
        </span>
      ))}
    </div>
  );
}
