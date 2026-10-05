import { sql } from "../db.ts";

// The chat's tools: one per thing a visitor can ask to see. Each reads its
// published content from the database; the frontend only renders the result.
// Jev picks the tool from the descriptions below (see router.ts), so a
// description is effectively that tool's routing criteria.
//
// Tool names double as the frontend's section keys (sidebar, chat history).

interface Tool {
  description: string;
  run: () => Promise<unknown>;
}

async function publishedSection(kind: string): Promise<unknown> {
  const [row] = await sql`SELECT published FROM entries WHERE id = ${kind} AND published IS NOT NULL`;
  return row?.published ?? null;
}

async function publishedProjects(): Promise<unknown[]> {
  const rows = await sql`
    SELECT id, show_in_sidebar, published FROM entries
    WHERE kind = 'project' AND published IS NOT NULL
    ORDER BY sort_order, created_at`;
  return rows.map((r) => ({ id: r.id, showInSidebar: r.show_in_sidebar, ...r.published }));
}

export const TOOLS = {
  about: {
    description: "Who Abhay is: bio, background, education, how he works, introduction",
    run: () => publishedSection("about"),
  },
  experience: {
    description: "Jobs, internships, roles, companies, work history",
    run: () => publishedSection("experience"),
  },
  skills: {
    description: "Tech stack, programming languages, frameworks, tools",
    run: () => publishedSection("skills"),
  },
  achievements: {
    description: "Awards, hackathon wins, competitive programming, rankings",
    run: () => publishedSection("achievements"),
  },
  projects: {
    description: "Things Abhay has built, apps, repositories, demos, case studies",
    run: publishedProjects,
  },
  contact: {
    description: "Email, socials, LinkedIn, GitHub, how to reach or hire him",
    run: () => publishedSection("contact"),
  },
} satisfies Record<string, Tool>;

export type ToolName = keyof typeof TOOLS;
export const isToolName = (name: string): name is ToolName => name in TOOLS;
