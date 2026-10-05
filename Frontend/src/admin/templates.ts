import type { ContentKind } from "@/portfolio/types";

/*
 * The edit form for each kind's fixed template. Field keys mirror
 * portfolio/types.ts; the same form edits AI drafts and hand-written content,
 * which is what keeps both on one template.
 */

export type Field =
  | { key: string; label: string; type: "text"; hint?: string; mono?: boolean }
  | { key: string; label: string; type: "textarea"; hint?: string; rows?: number; mono?: boolean }
  /** string[] edited one item per line */
  | { key: string; label: string; type: "lines"; hint?: string; rows?: number; mono?: boolean }
  | { key: string; label: string; type: "number"; hint?: string; min: number; max: number }
  | { key: string; label: string; type: "object"; fields: Field[] }
  /** Array of objects; `titleKey` names the field(s) shown on each collapsed item. */
  | { key: string; label: string; type: "list"; itemLabel: string; titleKey: string | string[]; fields: Field[] };

const text = (key: string, label: string, hint?: string): Field => ({ key, label, type: "text", hint });
const area = (key: string, label: string, hint?: string, rows = 3): Field => ({ key, label, type: "textarea", hint, rows });
const lines = (key: string, label: string, hint?: string, rows = 4): Field => ({ key, label, type: "lines", hint, rows });

const IMAGES = lines("images", "Images", "Paths from /public, one per line — e.g. /employlabs.png", 2);
const INLINE_HINT = "**bold** and *italic* work here";

const headed = (key: string, label: string, list: Field): Field => ({
  key,
  label,
  type: "object",
  fields: [text("title", "Heading"), text("tick", "Small caps label"), list],
});

const leadPoints: Field = {
  key: "points",
  label: "Points",
  type: "list",
  itemLabel: "Point",
  titleKey: "lead",
  fields: [text("lead", "Bold lead-in"), area("text", "Text", INLINE_HINT)],
};

export const TEMPLATES: Record<ContentKind, Field[]> = {
  about: [
    text("eyebrow", "Eyebrow", "Small line above the headline"),
    text("headline", "Headline"),
    text("subheadline", "Sub-headline"),
    lines("lede", "Intro paragraphs", `One paragraph per line — ${INLINE_HINT}`, 5),
    {
      key: "links",
      label: "Links",
      type: "list",
      itemLabel: "Link",
      titleKey: "label",
      fields: [text("label", "Label"), text("url", "URL", "https://… or mailto:…")],
    },
    {
      key: "depth",
      label: "Depth chart",
      type: "object",
      fields: [
        text("title", "Heading"),
        text("tick", "Small caps label"),
        {
          key: "scale",
          label: "Scale markers",
          type: "list",
          itemLabel: "Marker",
          titleKey: "label",
          fields: [text("label", "Label"), { key: "level", label: "Position (0–100)", type: "number", min: 0, max: 100 }],
        },
        {
          key: "rows",
          label: "Rows",
          type: "list",
          itemLabel: "Row",
          titleKey: "label",
          fields: [
            text("label", "Area"),
            { key: "level", label: "Depth (0–100)", type: "number", min: 0, max: 100, hint: "Below 30 renders muted" },
            text("note", "Note"),
          ],
        },
      ],
    },
    headed("evidence", "Evidence cards", {
      key: "cards",
      label: "Cards",
      type: "list",
      itemLabel: "Card",
      titleKey: "figure",
      fields: [
        text("kicker", "Kicker"),
        text("figure", "Figure", "e.g. <2s or 31% → 8%"),
        text("unit", "Unit"),
        area("body", "Body", INLINE_HINT),
        text("source", "Source line"),
      ],
    }),
    headed("approach", "How I work", leadPoints),
    headed("limits", "What I haven't done", leadPoints),
  ],

  experience: [
    text("opener", "Opening line"),
    text("heading", "Heading"),
    area("intro", "Intro", "Line breaks are kept", 4),
    area("quote", "Pull quote", undefined, 2),
    {
      key: "entries",
      label: "Entries",
      type: "list",
      itemLabel: "Entry",
      titleKey: ["title", "organization"],
      fields: [
        text("emoji", "Emoji"),
        text("title", "Title / role"),
        text("period", "Period", "e.g. April 2026 - June 2026"),
        text("organization", "Organization"),
        text("location", "Location"),
        text("tagline", "Tagline", "Italic line, for non-job entries"),
        IMAGES,
        area("summary", "Summary", "Paragraph before the bullets (optional)", 2),
        lines("bullets", "Bullets", `One per line — ${INLINE_HINT}`, 6),
        text("techStack", "Tech stack", "Comma-separated"),
        area("quote", "Closing quote", undefined, 2),
      ],
    },
  ],

  skills: [
    text("opener", "Opening line"),
    area("quote", "Pull quote", undefined, 2),
    text("languagesHeading", "Languages heading"),
    {
      key: "languages",
      label: "Programming languages",
      type: "list",
      itemLabel: "Language",
      titleKey: "name",
      fields: [
        text("emoji", "Emoji"),
        text("name", "Name"),
        text("level", "Level", "e.g. Advanced"),
        text("codeLanguage", "Code block language", "e.g. python, java, cpp"),
        { key: "snippet", label: "Snippet", type: "textarea", rows: 3, mono: true },
      ],
    },
    {
      key: "groups",
      label: "Skill groups",
      type: "list",
      itemLabel: "Group",
      titleKey: "heading",
      fields: [
        text("heading", "Heading"),
        text("intro", "Intro line"),
        text("codeLanguage", "Code block language", "e.g. code, python"),
        { key: "lines", label: "Lines", type: "lines", rows: 6, mono: true, hint: "One per line — “Category: item, item”" },
      ],
    },
  ],

  achievements: [
    area("opener", "Opening", "Line breaks are kept", 2),
    {
      key: "entries",
      label: "Achievements",
      type: "list",
      itemLabel: "Achievement",
      titleKey: "title",
      fields: [
        text("title", "Title"),
        text("recognition", "Recognition", "e.g. Winner — Event, Organiser (Month Year)"),
        IMAGES,
        area("problem", "Problem we solved"),
        area("solution", "Solution we proposed", undefined, 4),
      ],
    },
  ],

  contact: [
    text("opener", "Opening line"),
    area("quote", "Pull quote", undefined, 2),
    area("pitch", "Get in touch line", undefined, 2),
    text("email", "Email"),
    text("emailNote", "Note under email"),
    {
      key: "linkGroups",
      label: "Link groups",
      type: "list",
      itemLabel: "Group",
      titleKey: "title",
      fields: [
        text("emoji", "Emoji"),
        text("title", "Title"),
        {
          key: "links",
          label: "Links",
          type: "list",
          itemLabel: "Link",
          titleKey: "label",
          fields: [text("label", "Label"), text("value", "Address")],
        },
      ],
    },
    lines("openTo", "Open to", "One per line"),
    area("closingQuote", "Closing quote", undefined, 2),
  ],

  welcome: [
    text("greeting", "Greeting", "First line of the chat"),
    lines("intro", "Intro paragraphs", `One paragraph per line — ${INLINE_HINT}`, 3),
    text("prompt", "Question", "e.g. What would you like to know?"),
    {
      key: "topics",
      label: "Topics",
      type: "list",
      itemLabel: "Topic",
      titleKey: "label",
      fields: [
        text("tool", "Section", "One of: about, experience, skills, achievements, projects, contact"),
        text("label", "Label"),
        text("description", "Description", "5–6 words"),
      ],
    },
    {
      key: "resume",
      label: "Resume line",
      type: "object",
      fields: [text("text", "Text before the link", "e.g. Short on time?"), text("label", "Link label")],
    },
    text("linksLabel", "Links label", "e.g. Elsewhere:"),
    {
      key: "links",
      label: "Links",
      type: "list",
      itemLabel: "Link",
      titleKey: "label",
      fields: [text("label", "Label"), text("url", "URL", "https://… or mailto:…")],
    },
  ],

  project: [
    text("name", "Project name"),
    area("description", "Description", "1–2 sentences for the card and the project page", 2),
    text("meta", "Card footer", "Award line or core stack"),
    {
      key: "chats",
      label: "Chats",
      type: "list",
      itemLabel: "Chat",
      titleKey: "title",
      fields: [text("title", "Title"), text("time", "Time label", "e.g. 2 days ago (optional)")],
    },
    {
      key: "artifacts",
      label: "Artifacts",
      type: "list",
      itemLabel: "Artifact",
      titleKey: "title",
      fields: [
        text("title", "Title"),
        text("kind", "Kind", "e.g. Case study, Document"),
        area("content", "Content", "Paragraphs separated by a blank line", 10),
      ],
    },
  ],
};

/** A blank value for a set of fields — new list items and brand-new projects start from this. */
export function emptyValue(fields: Field[]): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const f of fields) {
    if (f.type === "text" || f.type === "textarea") out[f.key] = "";
    else if (f.type === "number") out[f.key] = 50;
    else if (f.type === "object") out[f.key] = emptyValue(f.fields);
    else out[f.key] = [];
  }
  return out;
}

/** A new project starts with the three standard artifacts, so hand-written ones keep the same template. */
export function emptyProject(): Record<string, unknown> {
  return {
    ...emptyValue(TEMPLATES.project),
    artifacts: [
      { title: "Overview", kind: "Case study", content: "" },
      { title: "Architecture", kind: "Document", content: "" },
      { title: "Build notes", kind: "Document", content: "" },
    ],
  };
}
