import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { NewsletterSignup } from "@/components/NewsletterSignup";

export default function NewsletterPage(): React.ReactElement {
  return (
    <section className="content-shell grid gap-6 py-8">
      <div className="max-w-3xl">
        <div className="mb-4 inline-flex rounded-full bg-primary-soft px-4 py-2 text-sm font-extrabold text-primary">
          월간 매수체크
        </div>
        <h1 className="text-balance text-4xl font-black leading-tight md:text-5xl">
          자양동 실거래 변화와 세금·규제 체크포인트를 쉽게 받아보세요
        </h1>
        <p className="mt-4 text-base leading-8 text-text-subtle">
          중요한 변화가 있을 때 이해하기 쉬운 말로 정리해 드리기 위한 준비
          단계입니다. 지금은 구독 완료 안내만 확인할 수 있어요.
        </p>
      </div>
      <NewsletterSignup />
      <Link
        className="focus-ring inline-flex min-h-12 w-fit items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-black text-white"
        href="/"
      >
        단지 검색으로 돌아가기
        <ArrowRight size={17} />
      </Link>
    </section>
  );
}
