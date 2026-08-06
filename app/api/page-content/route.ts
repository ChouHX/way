import { NextRequest, NextResponse } from "next/server";
import { getWorkerEnv, requireAdminSession } from "@/lib/cloudflare";

export const dynamic = "force-dynamic";

const validLocale = (value: string) => value === "zh" || value === "en";
const validPath = (value: string) => /^\/(?:[a-z0-9-]+(?:\/[a-z0-9-]+)*)?$/.test(value);
const validKey = (value: string) => /^[a-z0-9][a-z0-9._-]{0,79}$/.test(value);
const prefixFor = (locale: string, path: string) => `page_content:${locale}:${path}:`;

export async function GET(request: NextRequest) {
  try {
    const locale = request.nextUrl.searchParams.get("locale") || "";
    const path = request.nextUrl.searchParams.get("path") || "";
    if (!validLocale(locale) || !validPath(path))
      return NextResponse.json({ error: "Invalid page identifier" }, { status: 400 });
    const { DB } = await getWorkerEnv();
    if (!DB) return NextResponse.json({ content: {} });
    const prefix = prefixFor(locale, path);
    const { results } = await DB.prepare(
      "SELECT key,value FROM site_settings WHERE key GLOB ?",
    ).bind(`${prefix}*`).all<{ key: string; value: string }>();
    return NextResponse.json({
      content: Object.fromEntries(results.map((row) => [row.key.slice(prefix.length), row.value])),
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to load page content" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdminSession(request);
    const body = await request.json() as Record<string, unknown>;
    const locale = String(body.locale || "");
    const path = String(body.path || "");
    const key = String(body.key || "");
    const value = String(body.value || "").trim();
    if (!validLocale(locale) || !validPath(path) || !validKey(key))
      return NextResponse.json({ error: "Invalid content identifier" }, { status: 400 });
    if (!value || value.length > 5000)
      return NextResponse.json({ error: "内容不能为空且不能超过 5000 字" }, { status: 400 });
    const { DB } = await getWorkerEnv();
    if (!DB) return NextResponse.json({ error: "D1 binding is unavailable" }, { status: 503 });
    await DB.prepare(
      "INSERT INTO site_settings(key,value,updated_at) VALUES(?,?,CURRENT_TIMESTAMP) ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=CURRENT_TIMESTAMP",
    ).bind(`${prefixFor(locale, path)}${key}`, value).run();
    return NextResponse.json({ ok: true, value });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error(error);
    return NextResponse.json({ error: "Unable to save page content" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAdminSession(request);
    const body = await request.json() as Record<string, unknown>;
    const locale = String(body.locale || "");
    const path = String(body.path || "");
    const key = body.key == null ? "" : String(body.key);
    if (!validLocale(locale) || !validPath(path) || (key && !validKey(key)))
      return NextResponse.json({ error: "Invalid content identifier" }, { status: 400 });
    const { DB } = await getWorkerEnv();
    if (!DB) return NextResponse.json({ error: "D1 binding is unavailable" }, { status: 503 });
    if (key) {
      await DB.prepare("DELETE FROM site_settings WHERE key=?")
        .bind(`${prefixFor(locale, path)}${key}`).run();
    } else {
      const prefix = prefixFor(locale, path);
      await DB.prepare("DELETE FROM site_settings WHERE key GLOB ?")
        .bind(`${prefix}*`).run();
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error(error);
    return NextResponse.json({ error: "Unable to restore page content" }, { status: 500 });
  }
}
