CREATE TABLE IF NOT EXISTS case_types (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL REFERENCES case_categories(id) ON DELETE CASCADE,
  slug TEXT NOT NULL UNIQUE,
  name_zh TEXT NOT NULL,
  name_en TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_case_types_category ON case_types(category_id);

CREATE TABLE IF NOT EXISTS case_regions (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name_zh TEXT NOT NULL,
  name_en TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS guides (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  category_id TEXT REFERENCES case_categories(id) ON DELETE SET NULL,
  type_id TEXT REFERENCES case_types(id) ON DELETE SET NULL,
  title_zh TEXT NOT NULL, title_en TEXT NOT NULL,
  summary_zh TEXT NOT NULL DEFAULT '', summary_en TEXT NOT NULL DEFAULT '',
  content_zh TEXT NOT NULL, content_en TEXT NOT NULL,
  source_url TEXT, published INTEGER NOT NULL DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_guides_published ON guides(published, created_at DESC);

ALTER TABLE case_studies ADD COLUMN type_id TEXT REFERENCES case_types(id) ON DELETE SET NULL;
ALTER TABLE case_studies ADD COLUMN region_id TEXT REFERENCES case_regions(id) ON DELETE SET NULL;
ALTER TABLE case_studies ADD COLUMN guide_id TEXT REFERENCES guides(id) ON DELETE SET NULL;
ALTER TABLE case_studies ADD COLUMN case_date TEXT;
ALTER TABLE case_studies ADD COLUMN source_key TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_case_studies_source_key ON case_studies(source_key);
CREATE INDEX IF NOT EXISTS idx_case_studies_type ON case_studies(type_id);
CREATE INDEX IF NOT EXISTS idx_case_studies_region ON case_studies(region_id);
