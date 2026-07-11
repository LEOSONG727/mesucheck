import { NextRequest, NextResponse } from "next/server";
import { searchLegalDongs } from "@/lib/public-data/client";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  try {
    const items = await searchLegalDongs(query);
    return NextResponse.json({ items, count: items.length });
  } catch (error) {
    const message = error instanceof Error ? error.message : "법정동 조회 실패";
    const isInputError = message.includes("검색어");
    return NextResponse.json(
      { error: message },
      { status: isInputError ? 400 : 502 },
    );
  }
}
