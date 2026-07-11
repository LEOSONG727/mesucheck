import { NextRequest, NextResponse } from "next/server";
import { fetchApartmentTrades } from "@/lib/public-data/client";
import {
  buildApartmentSearchResults,
  recentYearMonths,
} from "@/lib/public-data/complex-discovery";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const params = request.nextUrl.searchParams;
  const lawdCd = params.get("lawdCd") ?? "";
  const dongName = params.get("dong")?.trim() ?? "";
  const fullLegalName = params.get("fullName")?.trim() ?? "";
  const monthCount = Number(params.get("months") ?? 6);

  if (!/^\d{5}$/.test(lawdCd)) {
    return NextResponse.json({ error: "lawdCd는 5자리 숫자여야 합니다." }, { status: 400 });
  }
  if (dongName.length < 1 || dongName.length > 30) {
    return NextResponse.json({ error: "법정동 이름을 확인해 주세요." }, { status: 400 });
  }
  if (fullLegalName.length < 2 || fullLegalName.length > 80) {
    return NextResponse.json({ error: "전체 법정동 주소를 확인해 주세요." }, { status: 400 });
  }
  if (!Number.isInteger(monthCount) || monthCount < 1 || monthCount > 12) {
    return NextResponse.json({ error: "months는 1~12 정수여야 합니다." }, { status: 400 });
  }

  try {
    const requestedMonths = recentYearMonths(monthCount);
    const trades = (
      await Promise.all(
        requestedMonths.map((month) => fetchApartmentTrades(lawdCd, month)),
      )
    ).flat();
    const items = buildApartmentSearchResults(trades, fullLegalName, dongName).slice(0, 80);
    return NextResponse.json({
      items,
      count: items.length,
      requestedMonths,
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "단지 조회 실패";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
