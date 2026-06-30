"use client";

import { Copy } from "lucide-react";
import { useToast } from "@/components/ToastProvider";

type ExpertQuestionListProps = {
  questions: string[];
};

export function ExpertQuestionList({
  questions,
}: ExpertQuestionListProps): React.ReactElement {
  const { showToast } = useToast();

  async function copyQuestion(question: string): Promise<void> {
    await navigator.clipboard.writeText(question);
    showToast("질문을 복사했어요. 중개사나 전문가에게 그대로 물어보세요.");
  }

  async function copyAll(): Promise<void> {
    await navigator.clipboard.writeText(questions.join("\n"));
    showToast("질문을 복사했어요. 중개사나 전문가에게 그대로 물어보세요.");
  }

  return (
    <section>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="text-xs font-extrabold uppercase tracking-[0.08em] text-muted">
          전문가에게 물어볼 질문
        </div>
        <button
          className="focus-ring rounded-full bg-primary-soft px-3 py-1.5 text-xs font-extrabold text-primary"
          onClick={copyAll}
          type="button"
        >
          전체 복사
        </button>
      </div>
      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-[var(--shadow-soft)]">
        {questions.map((question) => (
          <div
            className="flex gap-3 border-b border-[var(--border)] p-4 last:border-b-0"
            key={question}
          >
            <p className="min-w-0 flex-1 text-sm leading-7 text-text-subtle">
              {question}
            </p>
            <button
              className="focus-ring flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary"
              onClick={() => void copyQuestion(question)}
              type="button"
              aria-label="질문 복사"
            >
              <Copy size={16} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
