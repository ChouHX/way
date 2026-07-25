import { NextRequest, NextResponse } from "next/server";
import { clearAdminSession, createAdminSession, getWorkerEnv, requireAdminSession, validateAdminPassword } from "@/lib/cloudflare";

const json = (data: unknown, init?: ResponseInit) => NextResponse.json(data, init);

export async function GET(request: NextRequest) {
  try {
    await requireAdminSession(request);
    const env = await getWorkerEnv();
    if (!env.DB) return json({ error: "D1 binding is unavailable" }, { status: 503 });
    const resource = new URL(request.url).searchParams.get("resource") ?? "dashboard";
    if (resource === "site") { const { results } = await env.DB.prepare("SELECT key, value FROM site_settings").all<{ key: string; value: string }>(); return json({ settings: Object.fromEntries(results.map(item => [item.key, item.value])) }); }
    if (resource === "categories") { const { results } = await env.DB.prepare("SELECT * FROM case_categories ORDER BY sort_order, created_at").all(); return json({ categories: results }); }
    if (resource === "cases") { const { results } = await env.DB.prepare("SELECT c.*, k.name_zh AS category_name_zh, k.name_en AS category_name_en FROM case_studies c LEFT JOIN case_categories k ON k.id = c.category_id ORDER BY c.created_at DESC").all(); return json({ cases: results }); }
    const [settings, categories, cases] = await Promise.all([env.DB.prepare("SELECT key, value FROM site_settings").all(), env.DB.prepare("SELECT id FROM case_categories").all(), env.DB.prepare("SELECT id FROM case_studies").all()]);
    return json({ settings: settings.results.length, categories: categories.results.length, cases: cases.results.length });
  } catch (error) { if (error instanceof Response) return error; return json({ error: "Unable to load administration data" }, { status: 500 }); }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as Record<string, string | number | boolean | null>;
    if (body.action === "login") {
      if (!await validateAdminPassword(String(body.password ?? ""))) return json({ error: "密码不正确" }, { status: 401 });
      const response = json({ ok: true }); response.headers.set("Set-Cookie", await createAdminSession()); return response;
    }
    if (body.action === "logout") { const response = json({ ok: true }); response.headers.set("Set-Cookie", clearAdminSession()); return response; }
    await requireAdminSession(request);
    const env = await getWorkerEnv();
    if (!env.DB) return json({ error: "D1 binding is unavailable" }, { status: 503 });
    if (body.action === "site") {
      await env.DB.prepare("INSERT INTO site_settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP").bind("title_zh", String(body.titleZh ?? "")).run();
      await env.DB.prepare("INSERT INTO site_settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP").bind("title_en", String(body.titleEn ?? "")).run();
      return json({ ok: true });
    }
    if (body.action === "category") {
      const id = crypto.randomUUID(); await env.DB.prepare("INSERT INTO case_categories (id, slug, name_zh, name_en, sort_order) VALUES (?, ?, ?, ?, ?)").bind(id, String(body.slug), String(body.nameZh), String(body.nameEn), Number(body.sortOrder ?? 0)).run(); return json({ ok: true, id });
    }
    if (body.action === "case") {
      const id = crypto.randomUUID(); await env.DB.prepare("INSERT INTO case_studies (id, category_id, title_zh, title_en, summary_zh, summary_en, content_zh, content_en, image_url, published) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)").bind(id, body.categoryId || null, String(body.titleZh), String(body.titleEn), String(body.summaryZh), String(body.summaryEn), String(body.contentZh ?? ""), String(body.contentEn ?? ""), String(body.imageUrl ?? ""), body.published === false ? 0 : 1).run(); return json({ ok: true, id });
    }
    if (body.action === "update-case") {
      if (!body.id) return json({ error: "Case ID is required" }, { status: 400 });
      await env.DB.prepare("UPDATE case_studies SET category_id = ?, title_zh = ?, title_en = ?, summary_zh = ?, summary_en = ?, content_zh = ?, content_en = ?, image_url = ?, published = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(body.categoryId || null, String(body.titleZh), String(body.titleEn), String(body.summaryZh), String(body.summaryEn), String(body.contentZh ?? ""), String(body.contentEn ?? ""), String(body.imageUrl ?? ""), body.published === false ? 0 : 1, String(body.id)).run();
      return json({ ok: true, id: body.id });
    }
    return json({ error: "Unsupported action" }, { status: 400 });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error("Admin save failed", error);
    const message = error instanceof Error ? error.message : "Unable to save administration data";
    return json({ error: message }, { status: 500 });
  }
}
