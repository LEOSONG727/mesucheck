"use client";

import { Mail } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ToastProvider";

type NewsletterSignupProps = {
  compact?: boolean;
};

export function NewsletterSignup({
  compact = false,
}: NewsletterSignupProps): React.ReactElement {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const { showToast } = useToast();

  function submitNewsletter(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    setSubscribed(true);
    showToast("구독이 완료됐어요. 중요한 변화가 있으면 쉽게 정리해드릴게요.");
  }

  return (
    <section
      className={`rounded-[18px] bg-primary p-6 text-white shadow-[var(--shadow-soft)] ${
        compact ? "" : "md:p-8"
      }`}
    >
      <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-white/55">
        <Mail size={15} />
        월간 뉴스레터
      </div>
      <h2 className="max-w-xl text-balance text-2xl font-black leading-tight tracking-[-0.03em]">
        바뀌는 규제·세금, 나에게 미치는 영향만 쉽게
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-white/64">
        자양동 실거래 변화, 세금·규제 업데이트, 생애최초 체크포인트를 월 1회
        정리해 보내드려요.
      </p>
      <form className="mt-5 flex flex-col gap-3 sm:flex-row" onSubmit={submitNewsletter}>
        <input
          className="focus-ring min-h-12 flex-1 rounded-xl border border-white/20 bg-white/12 px-4 text-sm text-white outline-none placeholder:text-white/42"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="이메일 주소"
          required
          type="email"
          value={email}
        />
        <button
          className="focus-ring min-h-12 rounded-xl bg-accent px-5 text-sm font-extrabold text-white"
          type="submit"
        >
          {subscribed ? "구독 완료" : "구독하기"}
        </button>
      </form>
      <div className="mt-4 flex flex-wrap gap-2">
        {["실거래 변화", "취득세·세금", "대출 규제", "생애최초", "관심단지 알림"].map(
          (topic) => (
            <span
              className="rounded-full bg-white/12 px-3 py-1.5 text-xs font-bold text-white/76"
              key={topic}
            >
              {topic}
            </span>
          ),
        )}
      </div>
    </section>
  );
}
