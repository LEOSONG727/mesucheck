import { ShieldCheck } from "lucide-react";
import { getBasisDateLabel } from "@/lib/formatters";

type DisclaimerFooterProps = {
  disclaimer: string;
  basisDate: string;
};

export function DisclaimerFooter({
  disclaimer,
  basisDate,
}: DisclaimerFooterProps): React.ReactElement {
  return (
    <footer className="rounded-2xl border border-success/15 bg-success-soft p-5">
      <div className="flex gap-3">
        <ShieldCheck className="mt-0.5 shrink-0 text-success" size={20} />
        <div>
          <p className="text-sm leading-7 text-text-subtle">
            <strong className="text-success">입력 조건 기준의 참고 리포트입니다.</strong>{" "}
            {disclaimer.replace("입력 조건 기준의 참고 리포트입니다. ", "")}
          </p>
          <p className="mt-3 text-xs leading-6 text-muted">
            출처: 국토교통부 실거래가 공개시스템 검토용 데이터 · 법제처 국가법령정보센터
            검토용 데이터 · 행정안전부 지방세 검토용 데이터
            <br />
            {getBasisDateLabel(basisDate)} · 모든 법령/규칙 데이터는 검증 필요 상태입니다.
          </p>
        </div>
      </div>
    </footer>
  );
}
