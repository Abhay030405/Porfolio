import { z } from "zod";

// The fixed templates for every kind of portfolio content. AI drafts and
// hand-written edits both have to fit these exactly — the frontend renders
// them, so the site looks the same whichever way the content was written.
//
// Every field is required: "nothing here" is an empty string or empty array,
// never a missing key. That keeps the shapes valid for OpenRouter's strict
// structured outputs.
//
// Keep in sync with Frontend/src/portfolio/types.ts.

const text = z.string();
const lines = z.array(z.string());

/* ── About (rendered by AboutLevel0) ── */
const headed = { title: text, tick: text };

export const aboutSchema = z.object({
  eyebrow: text,
  headline: text,
  subheadline: text,
  /** Paragraphs; *word* renders as emphasis. */
  lede: lines,
  links: z.array(z.object({ label: text, url: text })),
  depth: z.object({
    ...headed,
    /** Column markers along the bars, at a 0–100 level. */
    scale: z.array(z.object({ label: text, level: z.number().min(0).max(100) })),
    rows: z.array(z.object({ label: text, level: z.number().min(0).max(100), note: text })),
  }),
  evidence: z.object({
    ...headed,
    cards: z.array(z.object({ kicker: text, figure: text, unit: text, body: text, source: text })),
  }),
  approach: z.object({ ...headed, points: z.array(z.object({ lead: text, text })) }),
  limits: z.object({ ...headed, points: z.array(z.object({ lead: text, text })) }),
});

/* ── Experience ── */
export const experienceSchema = z.object({
  opener: text,
  heading: text,
  intro: text,
  quote: text,
  entries: z.array(
    z.object({
      emoji: text,
      title: text,
      period: text,
      organization: text,
      location: text,
      tagline: text,
      images: lines,
      summary: text,
      bullets: lines,
      techStack: text,
      quote: text,
    }),
  ),
});

/* ── Skills ── */
export const skillsSchema = z.object({
  opener: text,
  quote: text,
  languagesHeading: text,
  languages: z.array(
    z.object({ emoji: text, name: text, level: text, codeLanguage: text, snippet: text }),
  ),
  groups: z.array(z.object({ heading: text, intro: text, codeLanguage: text, lines })),
});

/* ── Achievements ── */
export const achievementsSchema = z.object({
  opener: text,
  entries: z.array(
    z.object({ title: text, recognition: text, images: lines, problem: text, solution: text }),
  ),
});

/* ── Contact ── */
export const contactSchema = z.object({
  opener: text,
  quote: text,
  pitch: text,
  email: text,
  emailNote: text,
  linkGroups: z.array(
    z.object({ emoji: text, title: text, links: z.array(z.object({ label: text, value: text })) }),
  ),
  openTo: lines,
  closingQuote: text,
});

/* ── Project (one row per project) ── */
export const projectSchema = z.object({
  name: z.string().min(1),
  /** Project page description card and grid card. */
  description: text,
  /** Muted bottom line of the grid card, e.g. an award. */
  meta: text,
  /** Chat titles listed under the project in the sidebar and on its page. */
  chats: z.array(z.object({ title: text, time: text })),
  /** Cards on the project page; content paragraphs are split by blank lines. */
  artifacts: z.array(z.object({ title: text, kind: text, content: text })).min(1),
});

export const SCHEMAS = {
  about: aboutSchema,
  experience: experienceSchema,
  skills: skillsSchema,
  achievements: achievementsSchema,
  contact: contactSchema,
  project: projectSchema,
} as const;

export type Kind = keyof typeof SCHEMAS;
export const SECTION_KINDS = ["about", "experience", "skills", "achievements", "contact"] as const;
export const isKind = (k: string): k is Kind => k in SCHEMAS;

/*
 * JSON Schema for OpenRouter's strict structured outputs: every object closed
 * and fully required, and range/length keywords stripped (not every provider
 * accepts them — zod re-checks them on the way back in).
 */
export function strictJsonSchema(kind: Kind): Record<string, unknown> {
  const strip = (node: unknown): unknown => {
    if (Array.isArray(node)) return node.map(strip);
    if (!node || typeof node !== "object") return node;
    const out: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(node)) {
      if (["$schema", "minimum", "maximum", "minLength", "maxLength", "minItems", "maxItems"].includes(key)) continue;
      out[key] = strip(value);
    }
    if (out.type === "object" && out.properties) {
      out.additionalProperties = false;
      out.required = Object.keys(out.properties as object);
    }
    return out;
  };
  return strip(z.toJSONSchema(SCHEMAS[kind])) as Record<string, unknown>;
}
