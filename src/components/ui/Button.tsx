import Link from "next/link";
import { cn } from "@/lib/classnames";

type ButtonVariant = "primary" | "accent" | "secondary" | "ghost" | "soft";
type ButtonSize = "sm" | "md" | "lg" | "icon";

type ButtonOwnProps = {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  size?: ButtonSize;
  variant?: ButtonVariant;
};

type ButtonProps = ButtonOwnProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonOwnProps>;

type ButtonLinkProps = ButtonOwnProps & {
  href: string;
  prefetch?: boolean;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonOwnProps | "href">;

const variantClass: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white shadow-[var(--shadow-lifted)]",
  accent: "bg-accent text-white shadow-[var(--shadow-lifted)]",
  secondary:
    "border border-[var(--border-strong)] bg-white/88 text-text-subtle shadow-[var(--shadow-crisp)]",
  ghost: "border border-[var(--border)] bg-white/72 text-text-subtle shadow-[var(--shadow-crisp)]",
  soft: "bg-primary-soft text-primary shadow-[var(--shadow-crisp)]",
};

const sizeClass: Record<ButtonSize, string> = {
  sm: "min-h-10 rounded-full px-3 text-xs font-extrabold",
  md: "min-h-12 rounded-2xl px-4 text-sm font-extrabold",
  lg: "min-h-14 rounded-2xl px-5 text-base font-black",
  icon: "size-10 rounded-full p-0",
};

const baseClass =
  "focus-ring interactive-lift inline-flex items-center justify-center gap-2 disabled:pointer-events-none disabled:opacity-45";

export function buttonClassName({
  className,
  fullWidth,
  size = "md",
  variant = "primary",
}: Pick<ButtonOwnProps, "className" | "fullWidth" | "size" | "variant"> = {}): string {
  return cn(
    baseClass,
    variantClass[variant],
    sizeClass[size],
    fullWidth && "w-full",
    className,
  );
}

export function Button({
  children,
  className,
  fullWidth,
  leftIcon,
  rightIcon,
  size = "md",
  variant = "primary",
  ...props
}: ButtonProps): React.ReactElement {
  return (
    <button
      className={buttonClassName({ className, fullWidth, size, variant })}
      type={props.type ?? "button"}
      {...props}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  );
}

export function ButtonLink({
  children,
  className,
  fullWidth,
  href,
  leftIcon,
  prefetch,
  rightIcon,
  size = "md",
  variant = "primary",
  ...props
}: ButtonLinkProps): React.ReactElement {
  const isInternal = href.startsWith("/");
  const content = (
    <>
      {leftIcon}
      {children}
      {rightIcon}
    </>
  );

  if (isInternal) {
    return (
      <Link
        className={buttonClassName({ className, fullWidth, size, variant })}
        href={href}
        prefetch={prefetch}
      >
        {content}
      </Link>
    );
  }

  return (
    <a
      className={buttonClassName({ className, fullWidth, size, variant })}
      href={href}
      {...props}
    >
      {content}
    </a>
  );
}
