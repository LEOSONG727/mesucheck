import "server-only";

import type {
  ApartmentRent,
  ApartmentTrade,
  LegalDong,
} from "@/types/public-data";
import { parseXmlItems, readXmlTag } from "@/lib/public-data/xml";

const DEFAULT_TRADE_URL =
  "https://apis.data.go.kr/1613000/RTMSDataSvcAptTrade/getRTMSDataSvcAptTrade";
const DEFAULT_RENT_URL =
  "https://apis.data.go.kr/1613000/RTMSDataSvcAptRent/getRTMSDataSvcAptRent";
const DEFAULT_LEGAL_DONG_URL =
  "https://apis.data.go.kr/1741000/StanReginCd/getStanReginCdList";

export class PublicDataConfigurationError extends Error {}

export async function fetchApartmentTrades(
  lawdCd: string,
  dealYearMonth: string,
): Promise<ApartmentTrade[]> {
  assertLawdCd(lawdCd);
  assertYearMonth(dealYearMonth);
  const xml = await fetchPublicDataXml(
    process.env.MOLIT_APT_TRADE_API_URL || DEFAULT_TRADE_URL,
    { LAWD_CD: lawdCd, DEAL_YMD: dealYearMonth },
  );

  return parseXmlItems(xml).map((item) => ({
    apartmentName: item.aptNm,
    apartmentId: emptyToUndefined(item.aptSeq),
    lawdCd,
    dongName: item.umdNm,
    jibun: item.jibun,
    dealDate: toIsoDate(item.dealYear, item.dealMonth, item.dealDay),
    dealAmountKRW: parseTenThousandKRW(item.dealAmount),
    areaM2: parseNumber(item.excluUseAr),
    floor: parseOptionalNumber(item.floor),
    builtYear: parseOptionalNumber(item.buildYear),
    isCancelled: Boolean(item.cdealType?.trim() || item.cdealDay?.trim()),
    source: "molit_apt_trade",
  }));
}

export async function fetchApartmentRents(
  lawdCd: string,
  dealYearMonth: string,
): Promise<ApartmentRent[]> {
  assertLawdCd(lawdCd);
  assertYearMonth(dealYearMonth);
  const xml = await fetchPublicDataXml(
    process.env.MOLIT_APT_RENT_API_URL || DEFAULT_RENT_URL,
    { LAWD_CD: lawdCd, DEAL_YMD: dealYearMonth },
  );

  return parseXmlItems(xml).map((item) => ({
    apartmentName: item.aptNm,
    apartmentId: emptyToUndefined(item.aptSeq),
    lawdCd,
    dongName: item.umdNm,
    jibun: item.jibun,
    dealDate: toIsoDate(item.dealYear, item.dealMonth, item.dealDay),
    depositKRW: parseTenThousandKRW(item.deposit),
    monthlyRentKRW: parseTenThousandKRW(item.monthlyRent),
    areaM2: parseNumber(item.excluUseAr),
    floor: parseOptionalNumber(item.floor),
    builtYear: parseOptionalNumber(item.buildYear),
    source: "molit_apt_rent",
  }));
}

export async function searchLegalDongs(query: string): Promise<LegalDong[]> {
  const normalized = query.trim();
  if (normalized.length < 2 || normalized.length > 60) {
    throw new Error("법정동 검색어는 2~60자로 입력해 주세요.");
  }

  const body = await fetchPublicDataText(
    process.env.MOIS_LEGAL_DONG_API_URL || DEFAULT_LEGAL_DONG_URL,
    { type: "json", locatadd_nm: normalized },
    100,
    0,
    false,
  );
  const parsed = JSON.parse(body) as {
    StanReginCd?: Array<{ row?: Array<Record<string, string>> }>;
  };
  const rows = parsed.StanReginCd?.find((entry) => Array.isArray(entry.row))?.row ?? [];

  return rows.map((row) => ({
    regionCode: String(row.region_cd ?? ""),
    lawdCd: String(row.region_cd ?? "").slice(0, 5),
    sidoCode: String(row.sido_cd ?? ""),
    sigunguCode: String(row.sgg_cd ?? ""),
    eupMyeonDongCode: String(row.umd_cd ?? ""),
    fullName: String(row.locatadd_nm ?? ""),
    lowestName: String(row.locallow_nm ?? ""),
  }));
}

async function fetchPublicDataXml(
  baseUrl: string,
  params: Record<string, string>,
): Promise<string> {
  const xml = await fetchPublicDataText(baseUrl, params);
  const code = readXmlTag(xml, "resultCode");
  if (code && code !== "000" && code !== "00") {
    throw new Error(`Public API ${code}: ${readXmlTag(xml, "resultMsg") ?? "unknown"}`);
  }
  return xml;
}

async function fetchPublicDataText(
  baseUrl: string,
  params: Record<string, string>,
  numOfRows = 1000,
  revalidateSeconds = 3600,
  sendAcceptHeader = true,
): Promise<string> {
  const serviceKey = process.env.DATA_GO_KR_SERVICE_KEY?.trim();
  if (!serviceKey) {
    throw new PublicDataConfigurationError("DATA_GO_KR_SERVICE_KEY가 없습니다.");
  }

  const url = new URL(baseUrl);
  url.searchParams.set("serviceKey", serviceKey);
  url.searchParams.set("pageNo", "1");
  url.searchParams.set("numOfRows", String(numOfRows));
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const response = await fetch(url, {
    ...(revalidateSeconds > 0
      ? { next: { revalidate: revalidateSeconds } }
      : { cache: "no-store" as const }),
    headers: sendAcceptHeader
      ? { Accept: "application/xml, application/json;q=0.9" }
      : undefined,
    signal: AbortSignal.timeout(12_000),
  });
  if (!response.ok) {
    throw new Error(`Public API HTTP ${response.status}`);
  }
  return response.text();
}

function assertLawdCd(value: string): void {
  if (!/^\d{5}$/.test(value)) throw new Error("LAWD_CD는 5자리 숫자여야 합니다.");
}

function assertYearMonth(value: string): void {
  if (!/^\d{6}$/.test(value)) throw new Error("DEAL_YMD는 YYYYMM 형식이어야 합니다.");
}

function parseTenThousandKRW(value: string | undefined): number {
  return Math.round(parseNumber(value?.replaceAll(",", "")) * 10_000);
}

function parseNumber(value: string | undefined): number {
  const parsed = Number(value?.trim());
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseOptionalNumber(value: string | undefined): number | undefined {
  const parsed = parseNumber(value);
  return parsed === 0 && !value?.trim() ? undefined : parsed;
}

function emptyToUndefined(value: string | undefined): string | undefined {
  const normalized = value?.trim();
  return normalized || undefined;
}

function toIsoDate(year?: string, month?: string, day?: string): string {
  const y = Number(year);
  const m = Number(month);
  const d = Number(day);
  if (!Number.isInteger(y) || !Number.isInteger(m) || !Number.isInteger(d)) {
    throw new Error("공공데이터 거래일 형식이 올바르지 않습니다.");
  }
  return `${String(y).padStart(4, "0")}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}
