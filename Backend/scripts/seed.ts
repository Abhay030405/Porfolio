// Loads seed/content.ts into the database. Only fills entries that don't exist
// yet, so it never overwrites anything edited through the admin pages.
// Pass --force to overwrite the sections (projects are only ever added).
import { randomUUID } from "node:crypto";
import { sql } from "../src/db.ts";
import { SCHEMAS, SECTION_KINDS } from "../src/content/schemas.ts";
import * as seed from "../seed/content.ts";

const force = process.argv.includes("--force");

for (const kind of SECTION_KINDS) {
  const data = SCHEMAS[kind].parse(seed[kind]);
  const rows = force
    ? await sql`
        INSERT INTO entries (id, kind, published, published_at) VALUES (${kind}, ${kind}, ${JSON.stringify(data)}, now())
        ON CONFLICT (id) DO UPDATE SET published = EXCLUDED.published, published_at = now(), updated_at = now()
        RETURNING id`
    : await sql`
        INSERT INTO entries (id, kind, published, published_at) VALUES (${kind}, ${kind}, ${JSON.stringify(data)}, now())
        ON CONFLICT (id) DO NOTHING
        RETURNING id`;
  console.log(`${kind}: ${rows.length ? "seeded" : "already present, skipped"}`);
}

const [{ count }] = await sql`SELECT count(*)::int AS count FROM entries WHERE kind = 'project'`;
if (count > 0) {
  console.log(`projects: ${count} already present, skipped`);
} else {
  for (const [i, { showInSidebar, data }] of seed.projects.entries()) {
    const parsed = SCHEMAS.project.parse(data);
    await sql`
      INSERT INTO entries (id, kind, sort_order, show_in_sidebar, published, published_at)
      VALUES (${randomUUID()}, 'project', ${i}, ${showInSidebar}, ${JSON.stringify(parsed)}, now())`;
  }
  console.log(`projects: seeded ${seed.projects.length}`);
}
