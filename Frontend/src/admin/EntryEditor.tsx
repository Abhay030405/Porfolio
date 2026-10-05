import { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Check, FileUp, History, Loader2, PenLine, RefreshCw, Sparkles, X } from "lucide-react";
import { ApiError } from "@/lib/api";
import { PORTFOLIO_QUERY_KEY } from "@/portfolio/usePortfolio";
import { adminApi, type Entry, type UploadedDocument } from "./adminApi";
import { emptyProject, emptyValue, TEMPLATES } from "./templates";
import TemplateForm from "./TemplateForm";
import ContentPreview from "./ContentPreview";

/*
 * Editor for one entry, in either of two modes over the same fixed template:
 *
 *   AI + review   upload a document → AI drafts → approve / edit / reject /
 *                 regenerate with feedback
 *   Write myself  edit the form directly → save draft / publish
 *
 * Nothing reaches the public site until Publish (or Approve) is pressed.
 */

type Mode = "ai" | "manual";
type Busy = null | "upload" | "generate" | "save" | "publish" | "reject" | "restore";
type Value = Record<string, unknown>;

interface EntryEditorProps {
  entry: Entry;
  onEntryChange: (entry: Entry) => void;
}

const BUTTON =
  "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors disabled:opacity-40 disabled:pointer-events-none";
const PRIMARY = `${BUTTON} bg-foreground text-background hover:bg-foreground/90`;
const SECONDARY = `${BUTTON} border border-white/15 text-foreground hover:bg-white/[0.06]`;
const DANGER = `${BUTTON} text-destructive hover:bg-destructive/15`;

const formatDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "";

const EntryEditor = ({ entry, onEntryChange }: EntryEditorProps) => {
  const queryClient = useQueryClient();
  const fields = TEMPLATES[entry.kind];
  const blank = () => (entry.kind === "project" ? emptyProject() : emptyValue(fields));

  const [value, setValue] = useState<Value>(() => (entry.draft ?? entry.published ?? blank()) as Value);
  const [dirty, setDirty] = useState(false);
  const [mode, setMode] = useState<Mode>(entry.draftSource === "human" ? "manual" : "ai");
  const [busy, setBusy] = useState<Busy>(null);
  const [document, setDocument] = useState<UploadedDocument | null>(null);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState<{ message: string; issues: string[] } | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [revisions, setRevisions] = useState<{ id: string; createdAt: string }[] | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const hasAiDraft = entry.draft !== null && entry.draftSource === "ai";
  const canGenerate = Boolean(document || entry.draftDocument);

  /** Take the server's version of the entry as the new baseline. */
  const apply = (next: Entry, fallback?: Value) => {
    onEntryChange(next);
    setValue((next.draft ?? next.published ?? fallback ?? blank()) as Value);
    setDirty(false);
  };

  const run = async (kind: Busy, action: () => Promise<void>) => {
    setBusy(kind);
    setError(null);
    setNotice(null);
    try {
      await action();
    } catch (err) {
      setError(
        err instanceof ApiError ? { message: err.message, issues: err.issues } : { message: "Something went wrong", issues: [] },
      );
    } finally {
      setBusy(null);
    }
  };

  const upload = (file: File) =>
    run("upload", async () => {
      setDocument(await adminApi.upload(entry.kind, file));
    });

  const generate = () =>
    run("generate", async () => {
      apply(await adminApi.generate(entry.id, { documentId: document?.id }));
      setNotice("Draft ready — review it below.");
    });

  const regenerate = () =>
    run("generate", async () => {
      // The AI revises the draft as it stands, including any edits made here
      if (dirty) await adminApi.saveDraft(entry.id, value, "ai");
      apply(await adminApi.generate(entry.id, { feedback }));
      setFeedback("");
      setNotice("Draft regenerated with your feedback.");
    });

  const saveDraft = () =>
    run("save", async () => {
      apply(await adminApi.saveDraft(entry.id, value, mode === "ai" && hasAiDraft ? "ai" : "human"));
      setNotice("Draft saved. It isn't public until you publish.");
    });

  const publish = () =>
    run("publish", async () => {
      apply(await adminApi.publish(entry.id, value));
      await queryClient.invalidateQueries({ queryKey: PORTFOLIO_QUERY_KEY });
      setNotice("Published — it's live on the site.");
      setRevisions(null);
    });

  const reject = () =>
    run("reject", async () => {
      apply(await adminApi.rejectDraft(entry.id));
      setNotice("Draft rejected. The published version is unchanged.");
    });

  const discardChanges = () => {
    setValue((entry.draft ?? entry.published ?? blank()) as Value);
    setDirty(false);
    setError(null);
  };

  const loadRevisions = () =>
    run("restore", async () => {
      setRevisions(await adminApi.revisions(entry.id));
    });

  const restore = (revisionId: string) =>
    run("restore", async () => {
      apply(await adminApi.restore(entry.id, revisionId));
      setMode("manual");
      setNotice("Old version loaded as a draft. Publish it to roll back.");
    });

  return (
    <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
      {/* ── Editor column ── */}
      <div className="min-w-0 space-y-5">
        {/* Status */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <Badge tone={entry.published ? "green" : "muted"}>
            {entry.published ? `Published ${formatDate(entry.publishedAt)}` : "Not published"}
          </Badge>
          {entry.draft && <Badge tone="orange">{entry.draftSource === "ai" ? "AI draft" : "Draft"}</Badge>}
          {dirty && <Badge tone="orange">Unsaved changes</Badge>}
        </div>

        {/* Mode switch */}
        <div className="inline-flex rounded-xl border border-white/10 p-1">
          {(
            [
              ["ai", "AI + review", Sparkles],
              ["manual", "Write it myself", PenLine],
            ] as const
          ).map(([m, label, Icon]) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors ${
                mode === m ? "bg-white/10 text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" /> {label}
            </button>
          ))}
        </div>

        {mode === "ai" ? (
          <div className="space-y-4 rounded-xl border border-white/10 p-4">
            {/* 1. Source document */}
            <div>
              <div className="mb-2 text-sm font-medium text-foreground">Source document</div>
              <input
                ref={fileInput}
                type="file"
                accept=".pdf,.docx,.md,.markdown,.txt"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) upload(file);
                  e.target.value = "";
                }}
              />
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (file) upload(file);
                }}
                disabled={busy !== null}
                className="flex w-full flex-col items-center gap-1.5 rounded-xl border border-dashed border-white/20 px-4 py-6 text-center hover:border-white/35 hover:bg-white/[0.02] transition-colors"
              >
                {busy === "upload" ? (
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                ) : (
                  <FileUp className="h-5 w-5 text-muted-foreground" />
                )}
                <span className="text-sm text-foreground">
                  {document ? document.filename : "Drop a file or click to upload"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {document
                    ? `${document.chars.toLocaleString()} characters read`
                    : entry.draftDocument
                      ? "Or keep using the document from the last draft"
                      : "PDF, DOCX, Markdown or text · up to 10 MB"}
                </span>
              </button>
            </div>

            {/* 2. Generate */}
            <button type="button" onClick={generate} disabled={!canGenerate || busy !== null} className={PRIMARY}>
              {busy === "generate" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {busy === "generate" ? "Drafting… (20–60s)" : hasAiDraft ? "Generate a fresh draft" : "Generate draft"}
            </button>

            {/* 3. Review */}
            {hasAiDraft && (
              <div className="space-y-3 border-t border-white/10 pt-4">
                <div className="text-sm font-medium text-foreground">Review the draft</div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={publish} disabled={busy !== null} className={PRIMARY}>
                    {busy === "publish" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                    Approve & publish
                  </button>
                  <button
                    type="button"
                    onClick={() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    className={SECONDARY}
                  >
                    <PenLine className="h-4 w-4" /> Edit
                  </button>
                  {dirty && (
                    <button type="button" onClick={saveDraft} disabled={busy !== null} className={SECONDARY}>
                      Save edits
                    </button>
                  )}
                  <button type="button" onClick={reject} disabled={busy !== null} className={DANGER}>
                    <X className="h-4 w-4" /> Reject
                  </button>
                </div>
                <div className="space-y-2">
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={2}
                    placeholder="What should change? e.g. “Shorter bullets, and lead with the latency numbers”"
                    className="w-full resize-y rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-white/25"
                  />
                  <button
                    type="button"
                    onClick={regenerate}
                    disabled={!feedback.trim() || busy !== null}
                    className={SECONDARY}
                  >
                    <RefreshCw className={`h-4 w-4 ${busy === "generate" ? "animate-spin" : ""}`} /> Regenerate with feedback
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-white/10 p-4">
            <button type="button" onClick={publish} disabled={busy !== null} className={PRIMARY}>
              {busy === "publish" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              Publish
            </button>
            <button type="button" onClick={saveDraft} disabled={busy !== null || !dirty} className={SECONDARY}>
              {busy === "save" && <Loader2 className="h-4 w-4 animate-spin" />}
              Save draft
            </button>
            {dirty && (
              <button type="button" onClick={discardChanges} className={SECONDARY}>
                Discard changes
              </button>
            )}
            {entry.draft && !dirty && (
              <button type="button" onClick={reject} disabled={busy !== null} className={DANGER}>
                Delete draft
              </button>
            )}
          </div>
        )}

        {notice && <p className="text-sm text-emerald-400">{notice}</p>}
        {error && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            <p>{error.message}</p>
            {error.issues.length > 0 && (
              <ul className="mt-1 list-disc pl-5 text-xs">
                {error.issues.slice(0, 8).map((issue) => (
                  <li key={issue}>{issue}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* The template — the same form for AI drafts and hand-written content */}
        {(mode === "manual" || hasAiDraft || entry.published) && (
          <div ref={formRef} className="scroll-mt-4">
            <div className="mb-3 text-sm text-muted-foreground">
              {mode === "ai" && hasAiDraft ? "Edit anything before approving." : "Content"}
            </div>
            <TemplateForm
              fields={fields}
              value={value}
              onChange={(v) => {
                setValue(v);
                setDirty(true);
              }}
            />
          </div>
        )}

        {/* Revisions */}
        {entry.publishedAt && (
          <div className="border-t border-white/10 pt-4">
            {revisions === null ? (
              <button type="button" onClick={loadRevisions} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
                <History className="h-4 w-4" /> Earlier versions
              </button>
            ) : revisions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No earlier versions yet.</p>
            ) : (
              <div className="space-y-1">
                <div className="mb-2 text-sm text-muted-foreground">Earlier published versions</div>
                {revisions.map((r) => (
                  <div key={r.id} className="flex items-center justify-between text-sm">
                    <span className="text-foreground">{formatDate(r.createdAt)}</span>
                    <button type="button" onClick={() => restore(r.id)} disabled={busy !== null} className="text-muted-foreground hover:text-foreground">
                      Load as draft
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Live preview ── */}
      <div className="min-w-0">
        <div className="xl:sticky xl:top-4">
          <div className="mb-3 text-sm text-muted-foreground">Preview — exactly as visitors will see it</div>
          <div className="max-h-[calc(100dvh-8rem)] overflow-y-auto rounded-xl border border-white/10 bg-background p-4">
            {mode === "ai" && !hasAiDraft && !entry.published ? (
              <p className="text-sm text-muted-foreground">Upload a document and generate a draft to see it here.</p>
            ) : (
              <ContentPreview kind={entry.kind} value={value} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Badge = ({ tone, children }: { tone: "green" | "orange" | "muted"; children: React.ReactNode }) => (
  <span
    className={`rounded-full px-2.5 py-1 ${
      tone === "green"
        ? "bg-emerald-500/15 text-emerald-300"
        : tone === "orange"
          ? "bg-orange-500/15 text-orange-300"
          : "bg-white/[0.06] text-muted-foreground"
    }`}
  >
    {children}
  </span>
);

export default EntryEditor;
