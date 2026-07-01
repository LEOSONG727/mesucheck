"use client";

import { Copy } from "lucide-react";
import { useToast } from "@/components/ToastProvider";
import { Button } from "@/components/ui/Button";
import { Surface } from "@/components/ui/Surface";

type ExpertQuestionListProps = {
  questions: string[];
  showHeader?: boolean;
};

type QuestionGroup = {
  title: string;
  questions: string[];
};

export function ExpertQuestionList({
  questions,
  showHeader = true,
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

  async function copyGroup(group: QuestionGroup): Promise<void> {
    await navigator.clipboard.writeText(group.questions.join("\n"));
    showToast("질문을 복사했어요. 중개사나 전문가에게 그대로 물어보세요.");
  }

  const groups = groupQuestions(questions);

  return (
    <section>
      {showHeader ? (
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="text-xs font-extrabold text-muted">
            전문가에게 물어볼 질문
          </div>
          <Button
            onClick={copyAll}
            size="sm"
            type="button"
            variant="soft"
          >
            전체 복사
          </Button>
        </div>
      ) : (
        <div className="mb-3 flex justify-end">
          <Button
            onClick={copyAll}
            size="sm"
            type="button"
            variant="soft"
          >
            전체 복사
          </Button>
        </div>
      )}
      <div className="grid gap-3">
        {groups.map((group) => (
          <Surface
            className="overflow-hidden"
            key={group.title}
            padding="none"
            radius="md"
          >
            <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] bg-surface-muted px-4 py-3">
              <h3 className="text-sm font-black">{group.title}</h3>
              <Button
                onClick={() => void copyGroup(group)}
                size="sm"
                type="button"
                variant="ghost"
              >
                그룹 복사
              </Button>
            </div>
            {group.questions.map((question) => (
              <div
                className="flex gap-3 border-b border-[var(--border)] p-4 last:border-b-0"
                key={question}
              >
                <p className="min-w-0 flex-1 text-sm leading-7 text-text-subtle">
                  {question}
                </p>
                <Button
                  aria-label="질문 복사"
                  className="shrink-0"
                  onClick={() => void copyQuestion(question)}
                  size="icon"
                  type="button"
                  variant="soft"
                >
                  <Copy size={16} />
                </Button>
              </div>
            ))}
          </Surface>
        ))}
      </div>
    </section>
  );
}

function groupQuestions(questions: string[]): QuestionGroup[] {
  const tax = questions.filter((question) =>
    /취득세|생애최초|일시적 2주택|중과/.test(question),
  );
  const legal = questions.filter((question) =>
    /법무사|국민주택채권|공동명의/.test(question),
  );
  const loan = questions.filter((question) => /LTV|DSR|대출/.test(question));
  const used = new Set([...tax, ...legal, ...loan]);
  const brokerage = questions.filter((question) => !used.has(question));

  return [
    { title: "세무사에게 물어볼 질문", questions: tax },
    { title: "법무사에게 물어볼 질문", questions: legal },
    { title: "대출 상담사에게 물어볼 질문", questions: loan },
    { title: "중개사에게 물어볼 질문", questions: brokerage },
  ].filter((group) => group.questions.length > 0);
}
