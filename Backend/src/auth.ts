import { createHmac, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { Hono, type MiddlewareHandler } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { env } from "./env.ts";

// Single-admin auth: one password (stored only as a scrypt hash in
// ADMIN_PASSWORD_HASH) buys an httpOnly session cookie signed with
// SESSION_SECRET. Rotating SESSION_SECRET logs every session out.

const scryptAsync = promisify(scrypt) as (pw: string, salt: Buffer, len: number) => Promise<Buffer>;

const COOKIE = "pf_admin";
const SESSION_TTL_S = 7 * 24 * 60 * 60;
const KEY_LEN = 64;

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = await scryptAsync(password, salt, KEY_LEN);
  return `scrypt$${salt.toString("base64url")}$${hash.toString("base64url")}`;
}

async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, salt, hash] = stored.split("$");
  if (scheme !== "scrypt" || !salt || !hash) return false;
  const expected = Buffer.from(hash, "base64url");
  const actual = await scryptAsync(password, Buffer.from(salt, "base64url"), expected.length);
  return timingSafeEqual(actual, expected);
}

/* Session token: base64url(expiry) + "." + HMAC — nothing else to store. */
const sign = (payload: string) => createHmac("sha256", env.SESSION_SECRET).update(payload).digest("base64url");

function issueToken(): string {
  const payload = Buffer.from(String(Math.floor(Date.now() / 1000) + SESSION_TTL_S)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function isValidToken(token: string | undefined): boolean {
  if (!token || !env.SESSION_SECRET) return false;
  const [payload, mac] = token.split(".");
  if (!payload || !mac) return false;
  const expected = Buffer.from(sign(payload));
  const given = Buffer.from(mac);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return false;
  return Number(Buffer.from(payload, "base64url").toString()) > Date.now() / 1000;
}

export const requireAdmin: MiddlewareHandler = async (c, next) => {
  if (!isValidToken(getCookie(c, COOKIE))) return c.json({ error: "Unauthorized" }, 401);
  await next();
};

/* Login throttling: per client IP, in memory (fine for a single instance). */
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;
const attempts = new Map<string, { count: number; resetAt: number }>();

function clientIp(c: Parameters<MiddlewareHandler>[0]): string {
  const forwarded = c.req.header("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || c.env?.incoming?.socket?.remoteAddress || "unknown";
}

export const authRoutes = new Hono();

authRoutes.post("/login", async (c) => {
  if (!env.ADMIN_PASSWORD_HASH || !env.SESSION_SECRET) {
    return c.json({ error: "Admin login is not configured on the server" }, 503);
  }

  const ip = clientIp(c);
  const now = Date.now();
  const record = attempts.get(ip);
  if (record && record.resetAt > now && record.count >= MAX_ATTEMPTS) {
    c.header("Retry-After", String(Math.ceil((record.resetAt - now) / 1000)));
    return c.json({ error: "Too many attempts — try again later" }, 429);
  }

  const body = await c.req.json().catch(() => null);
  const password = typeof body?.password === "string" ? body.password : "";

  if (!password || !(await verifyPassword(password, env.ADMIN_PASSWORD_HASH))) {
    const fresh = !record || record.resetAt <= now;
    attempts.set(ip, { count: fresh ? 1 : record.count + 1, resetAt: fresh ? now + WINDOW_MS : record.resetAt });
    return c.json({ error: "Wrong password" }, 401);
  }

  attempts.delete(ip);
  setCookie(c, COOKIE, issueToken(), {
    httpOnly: true,
    // Browsers accept Secure cookies on http://localhost, so this holds in dev too
    secure: true,
    sameSite: "Lax",
    path: "/api",
    maxAge: SESSION_TTL_S,
  });
  return c.json({ ok: true });
});

authRoutes.post("/logout", (c) => {
  deleteCookie(c, COOKIE, { path: "/api", secure: true });
  return c.json({ ok: true });
});

authRoutes.get("/me", (c) =>
  isValidToken(getCookie(c, COOKIE)) ? c.json({ admin: true }) : c.json({ admin: false }, 401),
);
