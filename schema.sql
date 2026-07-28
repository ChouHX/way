CREATE TABLE IF NOT EXISTS site_assets (
  id TEXT PRIMARY KEY,
  section TEXT NOT NULL,
  title TEXT,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_site_assets_section ON site_assets(section);

CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO site_settings(key,value) VALUES
('contact_phone','(888) 123-4567'),
('contact_email','info@yongshengconsulting.com'),
('contact_address_zh','123 Main Street, Suite 100, New York, NY 10001'),
('contact_address_en','123 Main Street, Suite 100, New York, NY 10001'),
('contact_hours_zh','周一至周六 · 9:00 AM–6:00 PM'),
('contact_hours_en','Monday–Saturday · 9:00 AM–6:00 PM'),
('contact_map_url','https://www.google.com/maps?q=123%20Main%20Street%2C%20New%20York%2C%20NY%2010001&z=14&output=embed');

CREATE TABLE IF NOT EXISTS case_categories (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name_zh TEXT NOT NULL,
  name_en TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS case_types (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL REFERENCES case_categories(id) ON DELETE CASCADE,
  slug TEXT NOT NULL UNIQUE,
  name_zh TEXT NOT NULL,
  name_en TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

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
  title_zh TEXT NOT NULL,
  title_en TEXT NOT NULL,
  summary_zh TEXT NOT NULL DEFAULT '',
  summary_en TEXT NOT NULL DEFAULT '',
  content_zh TEXT NOT NULL,
  content_en TEXT NOT NULL,
  source_url TEXT,
  published INTEGER NOT NULL DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS case_studies (
  id TEXT PRIMARY KEY,
  category_id TEXT REFERENCES case_categories(id) ON DELETE SET NULL,
  type_id TEXT REFERENCES case_types(id) ON DELETE SET NULL,
  region_id TEXT REFERENCES case_regions(id) ON DELETE SET NULL,
  guide_id TEXT REFERENCES guides(id) ON DELETE SET NULL,
  title_zh TEXT NOT NULL,
  title_en TEXT NOT NULL,
  summary_zh TEXT NOT NULL,
  summary_en TEXT NOT NULL,
  content_zh TEXT,
  content_en TEXT,
  image_url TEXT,
  case_date TEXT,
  source_key TEXT UNIQUE,
  published INTEGER NOT NULL DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_case_studies_category ON case_studies(category_id);
CREATE INDEX IF NOT EXISTS idx_case_types_category ON case_types(category_id);
CREATE INDEX IF NOT EXISTS idx_case_studies_type ON case_studies(type_id);
CREATE INDEX IF NOT EXISTS idx_case_studies_region ON case_studies(region_id);
CREATE INDEX IF NOT EXISTS idx_guides_published ON guides(published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_case_studies_published ON case_studies(published, created_at DESC);

CREATE TABLE IF NOT EXISTS services (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  icon_key TEXT NOT NULL DEFAULT 'ticket',
  title_zh TEXT NOT NULL,
  title_en TEXT NOT NULL,
  short_title_zh TEXT NOT NULL,
  short_title_en TEXT NOT NULL,
  intro_zh TEXT NOT NULL DEFAULT '',
  intro_en TEXT NOT NULL DEFAULT '',
  overview_zh TEXT NOT NULL DEFAULT '',
  overview_en TEXT NOT NULL DEFAULT '',
  points_zh TEXT NOT NULL DEFAULT '[]',
  points_en TEXT NOT NULL DEFAULT '[]',
  steps_json TEXT NOT NULL DEFAULT '[]',
  image_url TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  published INTEGER NOT NULL DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_services_published_sort ON services(published, sort_order);

-- Existing service copy is seeded by migrations/0005_services.sql.
