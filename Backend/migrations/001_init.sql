-- Portfolio content. Every section (about, experience, skills, achievements,
-- contact) is one row whose id is its kind; every project is its own row.
-- `published` is what the public site serves, `draft` is work in progress
-- from the admin pages (AI-generated or hand-written), never served publicly.
CREATE TABLE IF NOT EXISTS entries (
  id              text PRIMARY KEY,
  kind            text NOT NULL CHECK (kind IN ('about', 'experience', 'skills', 'achievements', 'contact', 'project')),
  sort_order      integer NOT NULL DEFAULT 0,
  show_in_sidebar boolean NOT NULL DEFAULT true,
  published       jsonb,
  draft           jsonb,
  draft_source    text CHECK (draft_source IN ('ai', 'human')),
  draft_document  uuid,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  published_at    timestamptz
);

CREATE INDEX IF NOT EXISTS entries_kind_idx ON entries (kind, sort_order);

-- Uploaded source documents, kept so a draft can be regenerated without re-uploading.
CREATE TABLE IF NOT EXISTS documents (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind       text NOT NULL,
  filename   text NOT NULL,
  mime       text NOT NULL,
  size_bytes integer NOT NULL,
  text       text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Snapshot of an entry's previous published content, taken on every publish.
CREATE TABLE IF NOT EXISTS revisions (
  id         bigserial PRIMARY KEY,
  entry_id   text NOT NULL,
  data       jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS revisions_entry_idx ON revisions (entry_id, created_at DESC);

CREATE TABLE IF NOT EXISTS schema_migrations (
  name       text PRIMARY KEY,
  applied_at timestamptz NOT NULL DEFAULT now()
);
