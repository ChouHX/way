import { NextRequest, NextResponse } from "next/server";
import { getPublicCasesPage } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams;
  const data = await getPublicCasesPage({
    page: Number(query.get("page") || 1),
    pageSize: Number(query.get("pageSize") || 12),
    category: query.get("category") || "",
    type: query.get("type") || "",
    region: query.get("region") || "",
  });
  return NextResponse.json(data, {
    headers: { "Cache-Control": "no-store" },
  });
}
