/*
 * Where the backend lives. VITE_API_BASE_URL wins when set; on localhost the
 * Vite dev proxy handles /api; everywhere else (abhay.si and itsabhay.me) it's
 * the one deployed API at api.abhay.si.
 *
 * The admin session cookie is only sent same-site, so admin login works from
 * abhay.si; from itsabhay.me the public site works but log in via abhay.si.
 */
const PRODUCTION_API = "https://api.abhay.si";

export const API_BASE_URL: string = (() => {
  const configured = import.meta.env.VITE_API_BASE_URL;
  if (configured) return configured.replace(/\/$/, "");
  if (typeof window === "undefined") return "";
  const host = window.location.hostname;
  if (host === "localhost" || host === "127.0.0.1" || host === "::1") return "";
  return PRODUCTION_API;
})();

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly issues: string[] = [],
  ) {
    super(message);
  }
}

/** JSON fetch against the backend, sending the admin cookie. Throws ApiError on non-2xx. */
export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const isForm = init.body instanceof FormData;
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: isForm || !init.body ? init.headers : { "Content-Type": "application/json", ...init.headers },
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(res.status, data?.error ?? `Request failed (${res.status})`, data?.issues ?? []);
  return data as T;
}
