export function safeNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.replace(/,/g, "").trim();
    if (normalized.length === 0) {
      return fallback;
    }

    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
}

export function formatKRW(value: unknown): string {
  const amount = Math.round(safeNumber(value));
  return `${amount.toLocaleString("ko-KR")}원`;
}

export function formatKRWShort(value: unknown): string {
  const amount = Math.round(safeNumber(value));
  const sign = amount < 0 ? "-" : "";
  const abs = Math.abs(amount);
  const eok = Math.floor(abs / 100_000_000);
  const man = Math.floor((abs % 100_000_000) / 10_000);

  if (eok > 0 && man > 0) {
    return `${sign}${eok.toLocaleString("ko-KR")}억 ${man.toLocaleString("ko-KR")}만 원`;
  }

  if (eok > 0) {
    return `${sign}${eok.toLocaleString("ko-KR")}억 원`;
  }

  if (man > 0) {
    return `${sign}${man.toLocaleString("ko-KR")}만 원`;
  }

  return `${sign}${abs.toLocaleString("ko-KR")}원`;
}

export function formatAreaM2(value: unknown): string {
  const area = safeNumber(value);
  return `${area.toLocaleString("ko-KR", { maximumFractionDigits: 1 })}㎡`;
}

export function formatPyeong(areaM2: unknown): string {
  const area = safeNumber(areaM2);
  if (area <= 0) {
    return "0평";
  }

  return `${(area / 3.3058).toLocaleString("ko-KR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })}평`;
}

export function parseMolitAmountToKRW(value: string): number {
  const normalized = value.replace(/,/g, "").replace(/\s/g, "");
  const amountInManwon = safeNumber(normalized);
  return Math.round(amountInManwon * 10_000);
}

export function calculatePyeongPrice(priceKRW: unknown, areaM2: unknown): number {
  const price = safeNumber(priceKRW);
  const area = safeNumber(areaM2);

  if (price <= 0 || area <= 0) {
    return 0;
  }

  return Math.round(price / (area / 3.3058));
}

export function getBasisDateLabel(value: string): string {
  const date = new Date(`${value}T00:00:00+09:00`);

  if (Number.isNaN(date.getTime())) {
    return `${value} 기준`;
  }

  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 기준`;
}
