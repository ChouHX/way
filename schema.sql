CREATE TABLE IF NOT EXISTS site_assets (
  id TEXT PRIMARY KEY,
  section TEXT NOT NULL,
  title TEXT,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_site_assets_section ON site_assets(section);
