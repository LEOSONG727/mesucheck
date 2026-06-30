import type { ConfidenceLabel as ConfidenceLabelType } from "@/types/maesucheck";

const labelMap: Record<
  ConfidenceLabelType,
  { text: string; className: string }
> = {
  rule_based: {
    text: "규칙 기반",
    className: "bg-success-soft text-success border-success/15",
  },
  variable: {
    text: "변동 가능",
    className: "bg-warning-soft text-warning border-warning/15",
  },
  needs_expert_check: {
    text: "별도 확인",
    className: "bg-info-soft text-info border-info/15",
  },
  concept_only: {
    text: "참고 개념",
    className: "bg-surface-muted text-text-subtle border-[var(--border)]",
  },
};

type ConfidenceLabelProps = {
  value: ConfidenceLabelType;
};

export function ConfidenceLabel({
  value,
}: ConfidenceLabelProps): React.ReactElement {
  const label = labelMap[value];

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-extrabold ${label.className}`}
    >
      {label.text}
    </span>
  );
}

export function getConfidenceText(value: ConfidenceLabelType): string {
  return labelMap[value].text;
}
