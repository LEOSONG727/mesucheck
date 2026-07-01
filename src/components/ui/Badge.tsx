import { cn } from "@/lib/classnames";

type BadgeVariant =
  | "primary"
  | "success"
  | "warning"
  | "info"
  | "neutral"
  | "inverted";

type BadgeProps = {
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  variant?: BadgeVariant;
};

const variantClass: Record<BadgeVariant, string> = {
  primary: "bg-primary-soft text-primary border-primary/10",
  success: "bg-success-soft text-success border-success/15",
  warning: "bg-warning-soft text-warning border-warning/15",
  info: "bg-info-soft text-info border-info/15",
  neutral: "bg-surface-muted text-text-subtle border-[var(--border)]",
  inverted: "bg-white/10 text-white/78 border-white/10",
};

export function Badge({
  children,
  className,
  icon,
  variant = "neutral",
}: BadgeProps): React.ReactElement {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-extrabold shadow-[var(--shadow-crisp)]",
        variantClass[variant],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}
