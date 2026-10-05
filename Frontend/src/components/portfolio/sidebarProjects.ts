/*
 * The shape the sidebar, projects grid and project page render. Projects
 * themselves live in the database (edited on the admin page) and arrive via
 * useProjects() in portfolio/usePortfolio.ts.
 */
export interface ProjectArtifact {
  title: string;
  /** Shown under the title, e.g. "Document". */
  kind: string;
  /** Body text shown when the artifact is opened; blank lines split paragraphs. */
  content: string;
}

export interface SidebarProject {
  name: string;
  items: string[];
  /** When each item was last active, shown beside it on the project page (same order as items). */
  itemTimes: string[];
  /** Exactly the cards shown on the project page, in order. */
  artifacts: ProjectArtifact[];
  /** Shown in the project page's description card and on its grid card. */
  description?: string;
  /** Muted bottom line of the grid card, e.g. an award; falls back to counts. */
  meta?: string;
}

/* URL-safe form of a project name, e.g. "Mr.Talkative - Adv RAG" → "mr-talkative-adv-rag". */
export const projectSlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
