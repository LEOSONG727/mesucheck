import { cn } from "@/lib/classnames";

type TextInputProps = {
  className?: string;
  helper?: string;
  label?: string;
  leftIcon?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>;

export function TextInput({
  className,
  helper,
  label,
  leftIcon,
  ...props
}: TextInputProps): React.ReactElement {
  return (
    <label className="block">
      {label ? (
        <span className="mb-2 block text-xs font-extrabold text-muted">
          {label}
        </span>
      ) : null}
      <span
        className={cn(
          "flex min-h-13 items-center gap-3 rounded-2xl border border-white/12 bg-white px-4 text-foreground shadow-[var(--shadow-crisp)] focus-within:border-accent",
          className,
        )}
      >
        {leftIcon ? <span className="shrink-0 text-muted">{leftIcon}</span> : null}
        <input
          className="min-h-13 w-full bg-transparent text-base font-semibold outline-none placeholder:text-muted"
          {...props}
        />
      </span>
      {helper ? (
        <span className="mt-2 block text-xs font-medium text-muted">{helper}</span>
      ) : null}
    </label>
  );
}
