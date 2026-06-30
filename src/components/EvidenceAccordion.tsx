"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

type EvidenceAccordionProps = {
  title: string;
  basis: string;
  explanation: string;
  sourceUrl?: string;
  basisDate: string;
};

export function EvidenceAccordion({
  title,
  basis,
  explanation,
  sourceUrl,
  basisDate,
}: EvidenceAccordionProps): React.ReactElement {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-t border-[var(--border)] bg-surface-muted">
      <button
        className="focus-ring flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-extrabold text-primary"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        근거 보기 · {title}
        <ChevronDown
          className={`shrink-0 transition ${open ? "rotate-180" : ""}`}
          size={17}
        />
      </button>
      {open ? (
        <div className="px-4 pb-4 text-sm leading-7 text-text-subtle">
          <div className="font-extrabold text-foreground">{basis}</div>
          <p className="mt-1">{explanation}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-md border border-[var(--border)] bg-white px-2.5 py-1 text-xs font-bold text-muted">
              기준일 {basisDate}
            </span>
            {sourceUrl ? (
              <a
                className="focus-ring rounded-md border border-[var(--border)] bg-white px-2.5 py-1 text-xs font-bold text-primary"
                href={sourceUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                원문 보기
              </a>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
