import type {
  ApartmentTrade,
  PublicApartmentSearchResult,
  PublicComplexIdentity,
} from "@/types/public-data";

type ApartmentGroup = {
  apartmentName: string;
  lawdCd: string;
  dongName: string;
  jibun: string;
  builtYear?: number;
  trades: ApartmentTrade[];
};

const PUBLIC_ID_PREFIX = "public-v1";

export function buildApartmentSearchResults(
  trades: ApartmentTrade[],
  fullLegalName: string,
  dongName?: string,
): PublicApartmentSearchResult[] {
  const targetDong = normalizePlaceName(dongName ?? "");
  const groups = new Map<string, ApartmentGroup>();

  for (const trade of trades) {
    if (
      trade.isCancelled ||
      trade.dealAmountKRW <= 0 ||
      trade.areaM2 <= 0 ||
      (targetDong && normalizePlaceName(trade.dongName) !== targetDong)
    ) {
      continue;
    }

    const key = [
      normalizePlaceName(trade.apartmentName),
      normalizePlaceName(trade.dongName),
      trade.jibun.trim(),
    ].join("|");
    const group = groups.get(key) ?? {
      apartmentName: trade.apartmentName.trim(),
      lawdCd: trade.lawdCd,
      dongName: trade.dongName.trim(),
      jibun: trade.jibun.trim(),
      builtYear: trade.builtYear,
      trades: [],
    };
    group.trades.push(trade);
    if (trade.builtYear) group.builtYear = trade.builtYear;
    groups.set(key, group);
  }

  return Array.from(groups.values())
    .map((group) => {
      const sorted = [...group.trades].sort((a, b) =>
        b.dealDate.localeCompare(a.dealDate),
      );
      const recent = sorted[0];
      const byArea = new Map<number, ApartmentTrade[]>();
      for (const trade of sorted) {
        const areaM2 = roundArea(trade.areaM2);
        byArea.set(areaM2, [...(byArea.get(areaM2) ?? []), trade]);
      }

      return {
        apartmentName: group.apartmentName,
        lawdCd: group.lawdCd,
        dongName: group.dongName,
        jibun: group.jibun,
        builtYear: group.builtYear,
        tradeCount: sorted.length,
        recentDealDate: recent.dealDate,
        recentDealAmountKRW: recent.dealAmountKRW,
        areas: Array.from(byArea.entries())
          .map(([areaM2, areaTrades]) => {
            const areaRecent = areaTrades[0];
            return {
              complexId: createPublicComplexId({
                lawdCd: group.lawdCd,
                apartmentName: group.apartmentName,
                areaM2,
                fullLegalName,
              }),
              areaM2,
              tradeCount: areaTrades.length,
              recentDealDate: areaRecent.dealDate,
              recentDealAmountKRW: areaRecent.dealAmountKRW,
            };
          })
          .sort((a, b) => a.areaM2 - b.areaM2),
      } satisfies PublicApartmentSearchResult;
    })
    .sort((a, b) => {
      const dateOrder = b.recentDealDate.localeCompare(a.recentDealDate);
      return dateOrder || a.apartmentName.localeCompare(b.apartmentName, "ko");
    });
}

export function createPublicComplexId(identity: PublicComplexIdentity): string {
  if (!/^\d{5}$/.test(identity.lawdCd)) {
    throw new Error("공개데이터 단지의 법정동 코드가 올바르지 않습니다.");
  }
  if (
    identity.apartmentName.trim().length < 1 ||
    identity.fullLegalName.trim().length < 2 ||
    !Number.isFinite(identity.areaM2) ||
    identity.areaM2 <= 0 ||
    identity.areaM2 > 400
  ) {
    throw new Error("공개데이터 단지 식별값이 올바르지 않습니다.");
  }

  return [
    PUBLIC_ID_PREFIX,
    identity.lawdCd,
    String(Math.round(identity.areaM2 * 10)),
    textToHex(identity.apartmentName.trim()),
    textToHex(identity.fullLegalName.trim()),
  ].join(":");
}

export function parsePublicComplexId(value: string): PublicComplexIdentity | null {
  const [prefix, lawdCd, areaTenths, nameHex, legalNameHex, ...rest] = value.split(":");
  if (
    prefix !== PUBLIC_ID_PREFIX ||
    !/^\d{5}$/.test(lawdCd) ||
    !/^\d{1,4}$/.test(areaTenths) ||
    !nameHex ||
    !legalNameHex ||
    rest.length > 0
  ) {
    return null;
  }

  try {
    const apartmentName = hexToText(nameHex);
    const fullLegalName = hexToText(legalNameHex);
    const areaM2 = Number(areaTenths) / 10;
    if (
      apartmentName.length < 1 ||
      fullLegalName.length < 2 ||
      !Number.isFinite(areaM2) ||
      areaM2 <= 0 ||
      areaM2 > 400
    ) {
      return null;
    }
    return { lawdCd, apartmentName, areaM2, fullLegalName };
  } catch {
    return null;
  }
}

export function recentYearMonths(count: number, now = new Date()): string[] {
  if (!Number.isInteger(count) || count < 1 || count > 12) {
    throw new Error("조회 개월 수는 1~12 정수여야 합니다.");
  }
  const values: string[] = [];
  for (let offset = count - 1; offset >= 0; offset -= 1) {
    const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - offset, 1));
    values.push(`${date.getUTCFullYear()}${String(date.getUTCMonth() + 1).padStart(2, "0")}`);
  }
  return values;
}

function roundArea(value: number): number {
  return Math.round(value * 10) / 10;
}

function normalizePlaceName(value: string): string {
  return value.normalize("NFKC").replace(/\s+/g, "").toLowerCase();
}

function textToHex(value: string): string {
  return Array.from(new TextEncoder().encode(value), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

function hexToText(value: string): string {
  if (!/^(?:[0-9a-f]{2})+$/i.test(value)) {
    throw new Error("invalid hex");
  }
  const bytes = new Uint8Array(value.match(/.{2}/g)!.map((part) => Number.parseInt(part, 16)));
  return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
}
