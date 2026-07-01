import { cn } from "@/lib/classnames";

type SurfaceVariant = "default" | "premium" | "glass" | "muted" | "dark";
type SurfaceRadius = "md" | "lg" | "xl";
type SurfacePadding = "none" | "sm" | "md" | "lg";

type SurfaceProps = {
  as?: "a" | "div" | "section" | "article" | "aside" | "footer";
  children: React.ReactNode;
  className?: string;
  href?: string;
  interactive?: boolean;
  padding?: SurfacePadding;
  radius?: SurfaceRadius;
  rel?: string;
  target?: string;
  variant?: SurfaceVariant;
};

const variantClass: Record<SurfaceVariant, string> = {
  default: "border border-[var(--border)] bg-white shadow-[var(--shadow-soft)]",
  premium: "premium-panel",
  glass: "glass-panel",
  muted: "border border-[var(--border)] bg-surface-muted shadow-[var(--shadow-crisp)]",
  dark: "bg-primary-strong text-white shadow-[var(--shadow-lifted)]",
};

const radiusClass: Record<SurfaceRadius, string> = {
  md: "rounded-2xl",
  lg: "rounded-[24px]",
  xl: "rounded-[28px]",
};

const paddingClass: Record<SurfacePadding, string> = {
  none: "",
  sm: "p-3",
  md: "p-5",
  lg: "p-6 md:p-8",
};

export function Surface({
  as = "div",
  children,
  className,
  href,
  interactive = false,
  padding = "md",
  radius = "lg",
  rel,
  target,
  variant = "default",
}: SurfaceProps): React.ReactElement {
  const classes = cn(
    variantClass[variant],
    radiusClass[radius],
    paddingClass[padding],
    interactive && "interactive-lift",
    className,
  );

  if (as === "a") {
    return (
      <a className={classes} href={href} rel={rel} target={target}>
        {children}
      </a>
    );
  }

  const Component = as;

  return (
    <Component className={classes}>
      {children}
    </Component>
  );
}
