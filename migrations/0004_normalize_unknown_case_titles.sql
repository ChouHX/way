PRAGMA foreign_keys = ON;

-- The import source used "unknown" as a placeholder date.  It should not be
-- exposed as part of a case title or rendered as a date in the case details.
UPDATE case_studies
SET
  title_zh = TRIM(REPLACE(title_zh, ' (unknown)', '')),
  title_en = TRIM(REPLACE(title_en, ' (unknown)', '')),
  case_date = NULL,
  updated_at = CURRENT_TIMESTAMP
WHERE LOWER(TRIM(case_date)) = 'unknown'
   OR LOWER(TRIM(title_zh)) LIKE '%(unknown)%'
   OR LOWER(TRIM(title_en)) LIKE '%(unknown)%';
