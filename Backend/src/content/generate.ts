import { env } from "../env.ts";
import { SCHEMAS, strictJsonSchema, type Kind } from "./schemas.ts";

// Turns a source document into a draft that fits a fixed template, via
// OpenRouter structured outputs. The draft is only ever saved as a draft —
// publishing is a separate, human step.

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const TIMEOUT_MS = 180_000;

const BASE_RULES = `You write content for Abhay Agarwal's personal portfolio website, a ChatGPT-style chat interface.
Return JSON that matches the schema exactly.

Rules:
- Use only facts found in the SOURCE DOCUMENT or the CURRENT CONTENT. Never invent numbers, dates, companies, awards, links, people or technologies. When something is unknown, use an empty string or an empty array.
- Never invent reasons, motivations or design rationale the source doesn't state. Shorter and accurate beats longer and padded.
- Write in first person as Abhay. The CURRENT CONTENT is the style reference: match its voice, tone, sentence length and formatting conventions.
- Text fields may use **bold** and *italic*. No HTML, no markdown headings inside fields.
- Image fields: keep existing image paths exactly. New items get an empty array — images are added by hand.
- Keep existing content verbatim unless the document corrects or extends it.`;

const KIND_RULES: Record<Kind, string> = {
  about: `You are updating the About page. Keep its structure. Revise only what the document changes or adds.
depth.rows: one row per area, level 0–100 is honest depth (100 = on call for it in production, ~60 = debugged it in production, ~25 = shipped it once). Keep notes short and candid.
evidence.cards: exactly three cards, each backed by a concrete figure from the source.
limits.points: honest gaps; never remove existing ones unless the document shows they are no longer true.`,

  experience: `Return the complete Experience section.
Add each new role from the document as a new entry; order jobs newest first and keep non-job entries (such as competitive programming) after the jobs.
Job entries: period like "April 2026 - June 2026", organization, location ("Remote" or a city), 3–5 bullets, each one achievement that starts with a strong past-tense verb and carries the concrete numbers from the document; techStack is a comma-separated list. Leave tagline, summary and quote empty for jobs.
Pick an emoji that fits the role.`,

  skills: `Return the complete Skills section.
Merge new skills from the document into the best-fitting existing group as "Category: item, item" lines. Do not duplicate anything already listed. Only add a new group if nothing fits.
Add a language entry only for a programming language the document shows real use of; its snippet is 2–3 lines of that language printing short first-person statements, like the existing ones.`,

  achievements: `Return the complete Achievements section.
Add new achievements from the document as new entries at the top. recognition reads like "<placement> — <event>, <organiser> (<month year>)".
problem and solution are one paragraph each; solution says what was built and how, in "we" voice for team work.`,

  contact: `Return the complete Contact section. Update only the contact details and links the document provides.`,

  project: `Create the project page for the ONE project the document describes.
- name: the project's name, optionally followed by " — " and a short tagline.
- description: 1–2 sentences, under 200 characters, for the project card.
- meta: the award or recognition line (e.g. "1st Runner-Up · HACKATRON, IIITM Gwalior 2025"); if there is none, the core stack (e.g. "LangGraph · FastAPI · Postgres").
- chats: exactly 6 conversations a visitor might start about this project — specific questions in Title Case, under 80 characters each. time is always "".
- artifacts: exactly three, in this order:
  1. title "Overview", kind "Case study" — the problem, what it does, the outcome and its numbers.
  2. title "Architecture", kind "Document" — components, data flow, key design decisions and why.
  3. title "Build notes", kind "Document" — the hard parts, failed attempts, trade-offs, what comes next.
  Each content is up to 400 words of plain prose — shorter when the source has less to say; separate paragraphs with a blank line. No headings, bullets, bold or other markdown.`,
};

export interface GenerateInput {
  kind: Kind;
  /** Published content, or null for a brand-new project. */
  current: unknown;
  documentText: string;
  /** Set when regenerating: the rejected draft and what to change. */
  previousDraft?: unknown;
  feedback?: string;
}

export class GenerationError extends Error {}

export async function generateDraft({ kind, current, documentText, previousDraft, feedback }: GenerateInput) {
  if (!env.OPENROUTER_API_KEY) throw new GenerationError("OPENROUTER_API_KEY is not set on the server");

  const parts = [
    `CURRENT CONTENT (JSON):\n${current ? JSON.stringify(current, null, 2) : "(none — this is new)"}`,
    `SOURCE DOCUMENT:\n<<<\n${documentText || "(no document — work from the current content and feedback)"}\n>>>`,
  ];
  if (previousDraft) parts.push(`YOUR PREVIOUS DRAFT:\n${JSON.stringify(previousDraft, null, 2)}`);
  if (feedback?.trim()) parts.push(`REVIEWER FEEDBACK — revise the draft to address this:\n${feedback.trim()}`);

  const messages = [
    { role: "system", content: `${BASE_RULES}\n\n${KIND_RULES[kind]}` },
    { role: "user", content: parts.join("\n\n") },
  ];

  // One retry, telling the model what failed validation
  for (let attempt = 0; ; attempt++) {
    const raw = await callOpenRouter(kind, messages);
    let candidate: unknown;
    try {
      candidate = JSON.parse(raw);
    } catch {
      candidate = undefined;
    }
    const result = SCHEMAS[kind].safeParse(candidate);
    if (result.success) return result.data;
    if (attempt >= 1) throw new GenerationError("The AI returned content that doesn't fit the template");
    messages.push(
      { role: "assistant", content: raw },
      { role: "user", content: `That JSON is invalid: ${result.error?.message ?? "not parseable"}. Return corrected JSON only.` },
    );
  }
}

async function callOpenRouter(kind: Kind, messages: { role: string; content: string }[]): Promise<string> {
  const started = Date.now();
  const res = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://itsabhay.me",
      "X-Title": "itsabhay.me portfolio admin",
    },
    body: JSON.stringify({
      model: env.OPENROUTER_MODEL,
      messages,
      temperature: 0.4,
      response_format: {
        type: "json_schema",
        json_schema: { name: `portfolio_${kind}`, strict: true, schema: strictJsonSchema(kind) },
      },
      // Only route to providers that honour the schema
      provider: { require_parameters: true },
    }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  if (!res.ok) {
    console.error(`[generate] OpenRouter ${res.status}: ${await res.text()}`);
    throw new GenerationError(`AI service returned ${res.status}`);
  }
  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (typeof content !== "string") throw new GenerationError("AI service returned no content");
  console.log(
    `[generate] ${kind} via ${data.model ?? env.OPENROUTER_MODEL} in ${Date.now() - started}ms, ` +
      `${data.usage?.prompt_tokens ?? "?"} in / ${data.usage?.completion_tokens ?? "?"} out tokens`,
  );
  return content;
}
