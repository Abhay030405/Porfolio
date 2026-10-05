import { apiFetch } from "@/lib/api";
import type { ContentKind } from "@/portfolio/types";

/* Typed calls for the admin API (Backend/src/routes/admin.ts + auth). */

export interface Entry<T = unknown> {
  id: string;
  kind: ContentKind;
  sortOrder: number;
  showInSidebar: boolean;
  published: T | null;
  draft: T | null;
  draftSource: "ai" | "human" | null;
  draftDocument: string | null;
  updatedAt: string;
  publishedAt: string | null;
}

export interface UploadedDocument {
  id: string;
  filename: string;
  chars: number;
  preview: string;
}

/** react-query key for "is this browser logged in as admin". */
export const ADMIN_SESSION_KEY = ["admin-session"];

const json = (body: unknown) => JSON.stringify(body);

export const adminApi = {
  me: () => apiFetch<{ admin: boolean }>("/api/auth/me"),
  login: (password: string) => apiFetch<{ ok: true }>("/api/auth/login", { method: "POST", body: json({ password }) }),
  logout: () => apiFetch<{ ok: true }>("/api/auth/logout", { method: "POST" }),

  list: (kind: ContentKind) => apiFetch<Entry[]>(`/api/admin/entries?kind=${kind}`),
  get: (id: string) => apiFetch<Entry>(`/api/admin/entries/${id}`),
  createProject: () => apiFetch<Entry>("/api/admin/entries", { method: "POST", body: json({ kind: "project" }) }),
  update: (id: string, patch: { showInSidebar?: boolean; sortOrder?: number }) =>
    apiFetch<Entry>(`/api/admin/entries/${id}`, { method: "PATCH", body: json(patch) }),
  remove: (id: string) => apiFetch<{ ok: true }>(`/api/admin/entries/${id}`, { method: "DELETE" }),

  saveDraft: (id: string, data: unknown, source: "ai" | "human") =>
    apiFetch<Entry>(`/api/admin/entries/${id}/draft`, { method: "PUT", body: json({ data, source }) }),
  rejectDraft: (id: string) => apiFetch<Entry>(`/api/admin/entries/${id}/draft`, { method: "DELETE" }),
  generate: (id: string, opts: { documentId?: string; feedback?: string }) =>
    apiFetch<Entry>(`/api/admin/entries/${id}/generate`, { method: "POST", body: json(opts) }),
  publish: (id: string, data?: unknown) =>
    apiFetch<Entry>(`/api/admin/entries/${id}/publish`, { method: "POST", body: json(data ? { data } : {}) }),

  revisions: (id: string) => apiFetch<{ id: string; createdAt: string }[]>(`/api/admin/entries/${id}/revisions`),
  restore: (id: string, revisionId: string) =>
    apiFetch<Entry>(`/api/admin/entries/${id}/revisions/${revisionId}/restore`, { method: "POST" }),

  upload: (kind: ContentKind, file: File) => {
    const form = new FormData();
    form.append("kind", kind);
    form.append("file", file);
    return apiFetch<UploadedDocument>("/api/admin/documents", { method: "POST", body: form });
  },
};
