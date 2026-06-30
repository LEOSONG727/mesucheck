"use client";

import { ChevronDown } from "lucide-react";
import { useId, useState } from "react";

type CollapsibleSectionProps = {
  title: string;
  description?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
};

export function CollapsibleSection({
  title,
  description,
  defaultOpen = false,
  children,
}: CollapsibleSectionProps): React.ReactElement {
  const [open, setOpen] = useState(defaultOpen);
  const contentId = useId();

  return (
    <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-[var(--shadow-soft)]">
      <button
        aria-controls={contentId}
        aria-expanded={open}
        className="focus-ring flex w-full items-center justify-between gap-4 p-5 text-left"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <span>
          <span className="block text-base font-black">
            {title}
          </span>
          {description ? (
            <span className="mt-1 block text-sm leading-6 text-text-subtle">
              {description}
            </span>
          ) : null}
        </span>
        <ChevronDown
          className={`shrink-0 text-muted transition ${open ? "rotate-180" : ""}`}
          size={20}
        />
      </button>
      {open ? (
        <div className="border-t border-[var(--border)] p-5" id={contentId}>
          {children}
        </div>
      ) : null}
    </section>
  );
}
