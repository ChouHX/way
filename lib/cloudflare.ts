import { getCloudflareContext } from "@opennextjs/cloudflare";

export type D1Result<T = Record<string, unknown>> = { results: T[] };
export type D1Statement = { bind: (...values: unknown[]) => D1Statement; all: <T = Record<string, unknown>>() => Promise<D1Result<T>>; run: () => Promise<unknown> };
export type D1Database = { prepare: (query: string) => D1Statement };
export type WorkerEnv = { DB?: D1Database; ADMIN_PASSWORD?: string; APP_ENV?: string };

export async function getWorkerEnv() {
  const { env } = await getCloudflareContext({ async: true });
  return env as unknown as WorkerEnv;
}

const encoder = new TextEncoder();
const sessionCookie = "yongsheng_admin";
const sessionLifetime = 60 * 60 * 8;

const toBase64Url = (value: string) => btoa(value).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
const fromBase64Url = (value: string) => atob(value.replaceAll("-", "+").replaceAll("_", "/").padEnd(Math.ceil(value.length / 4) * 4, "="));
const cookieValue = (request: Request, name: string) => request.headers.get("cookie")?.split(";").map(item => item.trim()).find(item => item.startsWith(`${name}=`))?.slice(name.length + 1);

function sameBytes(a: Uint8Array, b: Uint8Array) {
  let difference = a.length ^ b.length;
  const length = Math.max(a.length, b.length);
  for (let index = 0; index < length; index += 1) difference |= (a[index % a.length] ?? 0) ^ (b[index % b.length] ?? 0);
  return difference === 0;
}

async function sha256(value: string) { return new Uint8Array(await crypto.subtle.digest("SHA-256", encoder.encode(value))); }
async function sign(value: string, secret: string) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(value)));
}

export async function validateAdminPassword(password: string) {
  const { ADMIN_PASSWORD } = await getWorkerEnv();
  if (!ADMIN_PASSWORD) throw new Response("ADMIN_PASSWORD is not configured", { status: 503 });
  return sameBytes(await sha256(password), await sha256(ADMIN_PASSWORD));
}

export async function createAdminSession() {
  const { ADMIN_PASSWORD, APP_ENV } = await getWorkerEnv();
  if (!ADMIN_PASSWORD) throw new Response("ADMIN_PASSWORD is not configured", { status: 503 });
  const payload = toBase64Url(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + sessionLifetime }));
  const signature = toBase64Url(String.fromCharCode(...await sign(payload, ADMIN_PASSWORD)));
  const secure = APP_ENV === "development" ? "" : "; Secure";
  return `${sessionCookie}=${payload}.${signature}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${sessionLifetime}${secure}`;
}

export async function requireAdminSession(request: Request) {
  const { ADMIN_PASSWORD } = await getWorkerEnv();
  if (!ADMIN_PASSWORD) throw new Response("ADMIN_PASSWORD is not configured", { status: 503 });
  const session = cookieValue(request, sessionCookie);
  const [payload, signature] = session?.split(".") ?? [];
  if (!payload || !signature) throw new Response("Unauthorized", { status: 401 });
  const expected = toBase64Url(String.fromCharCode(...await sign(payload, ADMIN_PASSWORD)));
  if (!sameBytes(encoder.encode(signature), encoder.encode(expected))) throw new Response("Unauthorized", { status: 401 });
  try {
    const data = JSON.parse(fromBase64Url(payload)) as { exp?: number };
    if (!data.exp || data.exp <= Math.floor(Date.now() / 1000)) throw new Error("Session expired");
  } catch { throw new Response("Unauthorized", { status: 401 }); }
}

export function clearAdminSession() { return `${sessionCookie}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`; }
