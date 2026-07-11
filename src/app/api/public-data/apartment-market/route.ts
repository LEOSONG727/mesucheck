import { NextRequest, NextResponse } from "next/server";
import { getComplexMarketSnapshot } from "@/lib/public-data/market-snapshot";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const params = request.nextUrl.searchParams;
  const lawdCd = params.get("lawdCd") ?? "";
  const apartmentName = params.get("apartmentName")?.trim() ?? "";
  const areaM2 = Number(params.get("areaM2"));
  const monthCount = Number(params.get("months") ?? 6);

  if (!/^\d{5}$/.test(lawdCd)) {
    return NextResponse.json({ error: "lawdCd는 5자리 숫자여야 합니다." }, { status: 400 });
  }
  if (apartmentName.length < 2 || apartmentName.length > 80) {
    return NextResponse.json({ error: "apartmentName을 확인해 주세요." }, { status: 400 });
  }
  if (!Number.isFinite(areaM2) || areaM2 <= 0 || areaM2 > 400) {
    return NextResponse.json({ error: "areaM2를 확인해 주세요." }, { status: 400 });
  }
  if (!Number.isInteger(monthCount) || monthCount < 1 || monthCount > 12) {
    return NextResponse.json({ error: "months는 1~12 정수여야 합니다." }, { status: 400 });
  }

  const snapshot = await getComplexMarketSnapshot(
    { name: apartmentName, lawdCd, defaultAreaM2: areaM2 },
    monthCount,
  );
  return NextResponse.json(snapshot, { status: snapshot.status === "unavailable" ? 502 : 200 });
}
