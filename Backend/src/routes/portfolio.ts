import { Hono } from "hono";
import { sql } from "../db.ts";

// Public read of everything published — the only content endpoint the site
// itself calls. Drafts never leave the admin API.

export const portfolioRoute = new Hono();

portfolioRoute.get("/", async (c) => {
  const rows = await sql`
    SELECT id, kind, show_in_sidebar, published
    FROM entries
    WHERE published IS NOT NULL
    ORDER BY sort_order, created_at`;

  const sections: Record<string, unknown> = {};
  const projects: unknown[] = [];
  for (const row of rows) {
    if (row.kind === "project") {
      projects.push({ id: row.id, showInSidebar: row.show_in_sidebar, ...row.published });
    } else {
      sections[row.kind] = row.published;
    }
  }

  // Short shared cache: a publish shows up within a minute
  c.header("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
  return c.json({ sections, projects });
});
