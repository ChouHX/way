import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

type D1Database = { prepare: (query: string) => { bind: (...values: string[]) => { all: <T>() => Promise<{ results: T[] }> } } };
type CloudflareEnv = { DB?: D1Database };

/**
 * Cloudflare Pages/Workers adapter exposes D1 on request.cf.env.DB.
 * Use /api/assets?section=hero or /api/assets?section=case-study.
 */
export async function GET(request: NextRequest) {
  const section = new URL(request.url).searchParams.get("section");
  const env = (request as NextRequest & { cf?: { env?: CloudflareEnv } }).cf?.env;

  if (!env?.DB) {
    return NextResponse.json({ assets: [], source: "no-d1-binding" });
  }

  const query = section
    ? env.DB.prepare("SELECT id, section, title, image_url, alt_text, created_at FROM site_assets WHERE section = ? ORDER BY created_at DESC").bind(section)
    : env.DB.prepare("SELECT id, section, title, image_url, alt_text, created_at FROM site_assets ORDER BY created_at DESC").bind();
  const { results } = await query.all();
  return NextResponse.json({ assets: results, source: "d1" }, { headers: { "Cache-Control": "public, max-age=300" } });
}
