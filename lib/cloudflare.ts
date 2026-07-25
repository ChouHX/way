import { getCloudflareContext } from "@opennextjs/cloudflare";

export type D1Result<T = Record<string, unknown>> = { results: T[] };
export type D1Statement = { bind: (...values: unknown[]) => D1Statement; all: <T = Record<string, unknown>>() => Promise<D1Result<T>>; run: () => Promise<unknown> };
export type D1Database = { prepare: (query: string) => D1Statement };
export type WorkerEnv = { DB?: D1Database; ADMIN_EMAILS?: string; APP_ENV?: string; LOCAL_ADMIN_EMAIL?: string };

export async function getWorkerEnv() {
  const { env } = await getCloudflareContext({ async: true });
  return env as unknown as WorkerEnv;
}

export async function requireAdmin(request: Request) {
  const env = await getWorkerEnv();
  const { ADMIN_EMAILS } = env;
  const accessEmail = request.headers.get("cf-access-authenticated-user-email")?.trim().toLowerCase();
  // This fallback is deliberately opt-in and exists only for `wrangler dev`.
  // Production must receive an identity from Cloudflare Access.
  const email = accessEmail ?? (env.APP_ENV === "development" ? env.LOCAL_ADMIN_EMAIL?.trim().toLowerCase() : undefined);
  const allowed = (ADMIN_EMAILS ?? "").split(",").map(value => value.trim().toLowerCase()).filter(Boolean);
  if (!email || !allowed.includes(email)) throw new Response("Unauthorized", { status: 401 });
  return { email, env };
}
