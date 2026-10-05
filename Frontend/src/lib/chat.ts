import { apiFetch } from "./api";
import type { ChatResult } from "@/portfolio/types";

/*
 * Asks the backend to answer a chat turn. With `query`, Jev picks which of
 * the portfolio tools answers; with `tool`, the visitor already picked (a
 * sidebar entry, a nav chip). The tool's content comes back from the database.
 * Throws when the backend can't be reached.
 */
const TIMEOUT_MS = 8000;

/* AbortSignal.timeout is missing on older Safari (< 16), so fall back to a controller. */
const timeoutSignal = (ms: number): AbortSignal => {
  if (typeof AbortSignal.timeout === "function") return AbortSignal.timeout(ms);
  const controller = new AbortController();
  setTimeout(() => controller.abort(), ms);
  return controller.signal;
};

export const askPortfolio = (request: { query: string } | { tool: string }) =>
  apiFetch<ChatResult>("/api/chat", {
    method: "POST",
    body: JSON.stringify(request),
    signal: timeoutSignal(TIMEOUT_MS),
  });
