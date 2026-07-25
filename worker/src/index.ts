// Kept local so the Next.js application can type-check without requiring
// @cloudflare/workers-types. Wrangler supplies the concrete bindings at runtime.
type D1Database = {
  prepare: (query: string) => {
    bind: (...values: string[]) => { all: () => Promise<{ results: unknown[] }> };
    all: () => Promise<{ results: unknown[] }>;
  };
};
export interface Env { DB: D1Database }

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname !== "/api/assets") return new Response("Not found", { status: 404 });
    const section = url.searchParams.get("section");
    const statement = section
      ? env.DB.prepare("SELECT id, section, title, image_url, alt_text, created_at FROM site_assets WHERE section = ? ORDER BY created_at DESC").bind(section)
      : env.DB.prepare("SELECT id, section, title, image_url, alt_text, created_at FROM site_assets ORDER BY created_at DESC");
    return Response.json({ assets: (await statement.all()).results }, { headers: { "Cache-Control": "public, max-age=300" } });
  },
};
