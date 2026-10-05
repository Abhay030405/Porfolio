// Applies every migrations/*.sql file not yet recorded in schema_migrations,
// in filename order. Safe to re-run.
import { readdir, readFile } from "node:fs/promises";
import { sql } from "../src/db.ts";

const dir = new URL("../migrations/", import.meta.url);

// The HTTP driver runs one statement per query, so split each file on the
// semicolons that end a line. Migrations must not use multi-statement bodies.
const statements = (file: string) =>
  file
    .split(/;\s*$/m)
    .map((s) => s.replace(/^\s*--.*$/gm, "").trim())
    .filter(Boolean);

await sql`CREATE TABLE IF NOT EXISTS schema_migrations (name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())`;
const applied = new Set((await sql`SELECT name FROM schema_migrations`).map((r) => r.name as string));

for (const name of (await readdir(dir)).filter((f) => f.endsWith(".sql")).sort()) {
  if (applied.has(name)) continue;
  const queries = statements(await readFile(new URL(name, dir), "utf8")).map((s) => sql.query(s));
  await sql.transaction([...queries, sql`INSERT INTO schema_migrations (name) VALUES (${name})`]);
  console.log(`applied ${name}`);
}
console.log("migrations up to date");
