import { NextRequest, NextResponse } from "next/server";
import { getWorkerEnv } from "@/lib/cloudflare";

export async function GET(request: NextRequest) {
  const section = new URL(request.url).searchParams.get("section");
  const env = await getWorkerEnv();

  if (!env?.DB) {
    return NextResponse.json({ assets: [], source: "no-d1-binding" });
  }

  const query = section
    ? env.DB.prepare("SELECT id, section, title, image_url, alt_text, created_at FROM site_assets WHERE section = ? ORDER BY created_at DESC").bind(section)
    : env.DB.prepare("SELECT id, section, title, image_url, alt_text, created_at FROM site_assets ORDER BY created_at DESC").bind();
  const { results } = await query.all();
  return NextResponse.json({ assets: results, source: "d1" }, { headers: { "Cache-Control": "public, max-age=300" } });
}
