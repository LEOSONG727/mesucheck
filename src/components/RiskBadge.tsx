import { AlertTriangle, CheckCircle2, Info, ShieldQuestion } from "lucide-react";
import { ConfidenceLabel } from "@/components/ConfidenceLabel";
import type { RiskBadgeItem } from "@/types/maesucheck";

type RiskBadgeProps = {
  item: RiskBadgeItem;
};

export function RiskBadge({ item }: RiskBadgeProps): React.ReactElement {
  const icon =
    item.confidenceLabel === "rule_based" ? (
      <CheckCircle2 size={18} />
    ) : item.confidenceLabel === "variable" ? (
      <AlertTriangle size={18} />
    ) : item.confidenceLabel === "needs_expert_check" ? (
      <ShieldQuestion size={18} />
    ) : (
      <Info size={18} />
    );

  return (
    <div className="flex gap-3 rounded-xl border border-[var(--border)] bg-white p-4">
      <div className="mt-0.5 text-primary">{icon}</div>
      <div className="min-w-0 flex-1">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <strong className="text-sm">{item.label}</strong>
          <ConfidenceLabel value={item.confidenceLabel} />
        </div>
        <p className="text-sm leading-6 text-text-subtle">{item.description}</p>
      </div>
    </div>
  );
}
