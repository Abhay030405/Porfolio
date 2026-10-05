import { randomUUID } from "node:crypto";
import { Hono, type Context } from "hono";
import { bodyLimit } from "hono/body-limit";
import { sql } from "../db.ts";
import { requireAdmin } from "../auth.ts";
import { isKind, SCHEMAS, type Kind } from "../content/schemas.ts";
import { extractDocumentText, MAX_UPLOAD_BYTES, UnsupportedDocumentError } from "../content/extract.ts";
import { generateDraft, GenerationError } from "../content/generate.ts";

// Everything that changes content. Mounted under /api/admin, every route here
// requires the admin session cookie.
//
// Lifecycle of an entry: draft (AI-generated or hand-written) → publish, which
// snapshots the old published version into `revisions` and clears the draft.

export const adminRoute = new Hono();
adminRoute.use("*", requireAdmin);

type Row = Record<string, any>;

const toEntry = (row: Row) => ({
  id: row.id as string,
  kind: row.kind as Kind,
  sortOrder: row.sort_order as number,
  showInSidebar: row.show_in_sidebar as boolean,
  published: row.published ?? null,
  draft: row.draft ?? null,
  draftSource: row.draft_source ?? null,
  draftDocument: row.draft_document ?? null,
  updatedAt: row.updated_at,
  publishedAt: row.published_at ?? null,
});

async function loadEntry(id: string): Promise<Row | null> {
  const [row] = await sql`SELECT * FROM entries WHERE id = ${id}`;
  return row ?? null;
}

const notFound = (c: Context) => c.json({ error: "Not found" }, 404);

/** Validates against the entry's template; returns the zod issues on failure. */
function validate(kind: Kind, data: unknown) {
  const result = SCHEMAS[kind].safeParse(data);
  return result.success
    ? { ok: true as const, data: result.data }
    : { ok: false as const, issues: result.error.issues.map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`) };
}

/* ── Entries ── */

adminRoute.get("/entries", async (c) => {
  const kind = c.req.query("kind");
  const rows = kind
    ? await sql`SELECT * FROM entries WHERE kind = ${kind} ORDER BY sort_order, created_at`
    : await sql`SELECT * FROM entries ORDER BY kind, sort_order, created_at`;
  return c.json(rows.map(toEntry));
});

adminRoute.get("/entries/:id", async (c) => {
  const row = await loadEntry(c.req.param("id"));
  return row ? c.json(toEntry(row)) : notFound(c);
});

// Only projects are created here; sections exist from the seed onwards
adminRoute.post("/entries", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  if (body?.kind !== "project") return c.json({ error: "Only projects can be created" }, 400);
  const [row] = await sql`
    INSERT INTO entries (id, kind, sort_order, show_in_sidebar)
    VALUES (${randomUUID()}, 'project',
            (SELECT COALESCE(MAX(sort_order), -1) + 1 FROM entries WHERE kind = 'project'),
            ${body.showInSidebar !== false})
    RETURNING *`;
  return c.json(toEntry(row), 201);
});

adminRoute.patch("/entries/:id", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const showInSidebar = typeof body?.showInSidebar === "boolean" ? body.showInSidebar : null;
  const sortOrder = Number.isInteger(body?.sortOrder) ? body.sortOrder : null;
  const [row] = await sql`
    UPDATE entries SET
      show_in_sidebar = COALESCE(${showInSidebar}::boolean, show_in_sidebar),
      sort_order      = COALESCE(${sortOrder}::integer, sort_order),
      updated_at      = now()
    WHERE id = ${c.req.param("id")}
    RETURNING *`;
  return row ? c.json(toEntry(row)) : notFound(c);
});

adminRoute.delete("/entries/:id", async (c) => {
  const row = await loadEntry(c.req.param("id"));
  if (!row) return notFound(c);
  if (row.kind !== "project") return c.json({ error: "Sections can't be deleted" }, 400);
  await sql.transaction([
    ...(row.published ? [sql`INSERT INTO revisions (entry_id, data) VALUES (${row.id}, ${JSON.stringify(row.published)})`] : []),
    sql`DELETE FROM entries WHERE id = ${row.id}`,
  ]);
  return c.json({ ok: true });
});

/* ── Drafts ── */

// Hand-written save, or AI draft after editing
adminRoute.put("/entries/:id/draft", async (c) => {
  const row = await loadEntry(c.req.param("id"));
  if (!row) return notFound(c);
  const body = await c.req.json().catch(() => null);
  const checked = validate(row.kind, body?.data);
  if (!checked.ok) return c.json({ error: "Doesn't fit the template", issues: checked.issues }, 422);
  const source = body?.source === "ai" ? "ai" : "human";
  const [updated] = await sql`
    UPDATE entries SET draft = ${JSON.stringify(checked.data)}, draft_source = ${source}, updated_at = now()
    WHERE id = ${row.id}
    RETURNING *`;
  return c.json(toEntry(updated));
});

// Reject
adminRoute.delete("/entries/:id/draft", async (c) => {
  const [row] = await sql`
    UPDATE entries SET draft = NULL, draft_source = NULL, draft_document = NULL, updated_at = now()
    WHERE id = ${c.req.param("id")}
    RETURNING *`;
  return row ? c.json(toEntry(row)) : notFound(c);
});

// Generate, or regenerate with feedback when a draft already exists
adminRoute.post("/entries/:id/generate", async (c) => {
  const row = await loadEntry(c.req.param("id"));
  if (!row) return notFound(c);
  const body = await c.req.json().catch(() => ({}));
  const feedback = typeof body?.feedback === "string" ? body.feedback : "";
  const documentId: string | null = body?.documentId ?? row.draft_document ?? null;

  let documentText = "";
  if (documentId) {
    const [doc] = await sql`SELECT text FROM documents WHERE id = ${documentId}`;
    if (!doc) return c.json({ error: "Document not found" }, 404);
    documentText = doc.text;
  }
  if (!documentText && !feedback.trim()) {
    return c.json({ error: "Upload a document or give feedback to generate from" }, 400);
  }

  try {
    const draft = await generateDraft({
      kind: row.kind,
      current: row.published,
      documentText,
      previousDraft: feedback ? row.draft : undefined,
      feedback,
    });
    const [updated] = await sql`
      UPDATE entries SET draft = ${JSON.stringify(draft)}, draft_source = 'ai', draft_document = ${documentId}, updated_at = now()
      WHERE id = ${row.id}
      RETURNING *`;
    return c.json(toEntry(updated));
  } catch (err) {
    console.error("[generate] failed:", err);
    const message = err instanceof GenerationError ? err.message : "Generation failed";
    return c.json({ error: message }, 502);
  }
});

/* ── Publish & revisions ── */

// Publishes `data` if given (so an edited draft can be approved in one step), else the stored draft
adminRoute.post("/entries/:id/publish", async (c) => {
  const row = await loadEntry(c.req.param("id"));
  if (!row) return notFound(c);
  const body = await c.req.json().catch(() => ({}));
  const candidate = body?.data ?? row.draft;
  if (!candidate) return c.json({ error: "Nothing to publish" }, 400);
  const checked = validate(row.kind, candidate);
  if (!checked.ok) return c.json({ error: "Doesn't fit the template", issues: checked.issues }, 422);

  const results = await sql.transaction([
    ...(row.published ? [sql`INSERT INTO revisions (entry_id, data) VALUES (${row.id}, ${JSON.stringify(row.published)})`] : []),
    sql`
      UPDATE entries SET published = ${JSON.stringify(checked.data)}, published_at = now(),
                         draft = NULL, draft_source = NULL, draft_document = NULL, updated_at = now()
      WHERE id = ${row.id}
      RETURNING *`,
  ]);
  return c.json(toEntry(results[results.length - 1][0]));
});

adminRoute.get("/entries/:id/revisions", async (c) => {
  const rows = await sql`
    SELECT id, created_at FROM revisions WHERE entry_id = ${c.req.param("id")} ORDER BY created_at DESC LIMIT 50`;
  return c.json(rows.map((r) => ({ id: String(r.id), createdAt: r.created_at })));
});

// Restores into the draft, so a rollback still goes through review + publish
adminRoute.post("/entries/:id/revisions/:revisionId/restore", async (c) => {
  const [rev] = await sql`
    SELECT data FROM revisions WHERE id = ${c.req.param("revisionId")} AND entry_id = ${c.req.param("id")}`;
  if (!rev) return notFound(c);
  const [row] = await sql`
    UPDATE entries SET draft = ${JSON.stringify(rev.data)}, draft_source = 'human', updated_at = now()
    WHERE id = ${c.req.param("id")}
    RETURNING *`;
  return row ? c.json(toEntry(row)) : notFound(c);
});

/* ── Source documents ── */

adminRoute.post(
  "/documents",
  bodyLimit({ maxSize: MAX_UPLOAD_BYTES + 64 * 1024, onError: (c) => c.json({ error: "File is larger than 10 MB" }, 413) }),
  async (c) => {
    const form = await c.req.formData().catch(() => null);
    const file = form?.get("file");
    const kind = String(form?.get("kind") ?? "");
    if (!(file instanceof File)) return c.json({ error: "Attach a file in the `file` field" }, 400);
    if (!isKind(kind)) return c.json({ error: "Unknown kind" }, 400);

    let text: string;
    try {
      text = await extractDocumentText(file.name, file.type, new Uint8Array(await file.arrayBuffer()));
    } catch (err) {
      if (err instanceof UnsupportedDocumentError) return c.json({ error: err.message }, 415);
      console.error("[documents] extraction failed:", err);
      return c.json({ error: "Couldn't read that file" }, 422);
    }
    if (!text) return c.json({ error: "No text found in that file (is it a scanned image?)" }, 422);

    const [doc] = await sql`
      INSERT INTO documents (kind, filename, mime, size_bytes, text)
      VALUES (${kind}, ${file.name}, ${file.type || "application/octet-stream"}, ${file.size}, ${text})
      RETURNING id, filename, created_at`;
    return c.json({ id: doc.id, filename: doc.filename, chars: text.length, preview: text.slice(0, 400) }, 201);
  },
);
