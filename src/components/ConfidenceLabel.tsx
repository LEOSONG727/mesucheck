import { Badge } from "@/components/ui/Badge";
import type { ConfidenceLabel as ConfidenceLabelType } from "@/types/maesucheck";

const labelMap: Record<
  ConfidenceLabelType,
  { text: string; variant: React.ComponentProps<typeof Badge>["variant"] }
> = {
  rule_based: {
    text: "규칙 기반",
    variant: "success",
  },
  variable: {
    text: "변동 가능",
    variant: "warning",
  },
  needs_expert_check: {
    text: "별도 확인",
    variant: "info",
  },
  concept_only: {
    text: "참고 개념",
    variant: "neutral",
  },
};

type ConfidenceLabelProps = {
  value: ConfidenceLabelType;
};

export function ConfidenceLabel({
  value,
}: ConfidenceLabelProps): React.ReactElement {
  const label = labelMap[value];

  return <Badge variant={label.variant}>{label.text}</Badge>;
}

export function getConfidenceText(value: ConfidenceLabelType): string {
  return labelMap[value].text;
}
