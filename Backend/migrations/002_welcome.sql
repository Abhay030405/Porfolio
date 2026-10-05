-- The welcome message is a section like the others: one row, id 'welcome'.
ALTER TABLE entries DROP CONSTRAINT IF EXISTS entries_kind_check;
ALTER TABLE entries ADD CONSTRAINT entries_kind_check
  CHECK (kind IN ('about', 'experience', 'skills', 'achievements', 'contact', 'welcome', 'project'));
