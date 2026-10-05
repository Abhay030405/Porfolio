/*
 * The fixed content templates, as served by /api/portfolio and edited on the
 * admin pages. Every field is always present; "nothing here" is "" or [].
 *
 * Keep in sync with Backend/src/content/schemas.ts.
 */

export interface AboutContent {
  eyebrow: string;
  headline: string;
  subheadline: string;
  /** Paragraphs; *word* renders as emphasis. */
  lede: string[];
  links: { label: string; url: string }[];
  depth: {
    title: string;
    tick: string;
    scale: { label: string; level: number }[];
    rows: { label: string; level: number; note: string }[];
  };
  evidence: {
    title: string;
    tick: string;
    cards: { kicker: string; figure: string; unit: string; body: string; source: string }[];
  };
  approach: { title: string; tick: string; points: { lead: string; text: string }[] };
  limits: { title: string; tick: string; points: { lead: string; text: string }[] };
}

export interface ExperienceContent {
  opener: string;
  heading: string;
  intro: string;
  quote: string;
  entries: {
    emoji: string;
    title: string;
    period: string;
    organization: string;
    location: string;
    tagline: string;
    images: string[];
    summary: string;
    bullets: string[];
    techStack: string;
    quote: string;
  }[];
}

export interface SkillsContent {
  opener: string;
  quote: string;
  languagesHeading: string;
  languages: { emoji: string; name: string; level: string; codeLanguage: string; snippet: string }[];
  groups: { heading: string; intro: string; codeLanguage: string; lines: string[] }[];
}

export interface AchievementsContent {
  opener: string;
  entries: { title: string; recognition: string; images: string[]; problem: string; solution: string }[];
}

export interface ContactContent {
  opener: string;
  quote: string;
  pitch: string;
  email: string;
  emailNote: string;
  linkGroups: { emoji: string; title: string; links: { label: string; value: string }[] }[];
  openTo: string[];
  closingQuote: string;
}

/** The first message in the chat. Not a tool — it points visitors at the tools. */
export interface WelcomeContent {
  greeting: string;
  /** Paragraphs; **bold** and *italic* work. */
  intro: string[];
  prompt: string;
  topics: { tool: ToolName; label: string; description: string }[];
  resume: { text: string; label: string };
  linksLabel: string;
  links: { label: string; url: string }[];
}

export interface ProjectContent {
  name: string;
  description: string;
  meta: string;
  chats: { title: string; time: string }[];
  artifacts: { title: string; kind: string; content: string }[];
}

export interface SectionContents {
  about: AboutContent;
  experience: ExperienceContent;
  skills: SkillsContent;
  achievements: AchievementsContent;
  contact: ContactContent;
  welcome: WelcomeContent;
}

export type SectionKind = keyof SectionContents;
export type ContentKind = SectionKind | "project";

export interface PublishedProject extends ProjectContent {
  id: string;
  showInSidebar: boolean;
}

export interface PortfolioResponse {
  sections: Partial<SectionContents>;
  projects: PublishedProject[];
}

/* ── Chat tools (Backend/src/chat/tools.ts) ── */

export type ToolName = Exclude<SectionKind, "welcome"> | "projects";

/** POST /api/chat — `tool` and `data` are null when no tool fits the query. */
export type ChatResult = { routedBy: "direct" | "jev" | "keywords"; confidence: number | null } & (
  | { tool: null; data: null }
  | { tool: "about"; data: AboutContent | null }
  | { tool: "experience"; data: ExperienceContent | null }
  | { tool: "skills"; data: SkillsContent | null }
  | { tool: "achievements"; data: AchievementsContent | null }
  | { tool: "contact"; data: ContactContent | null }
  | { tool: "projects"; data: PublishedProject[] }
);
