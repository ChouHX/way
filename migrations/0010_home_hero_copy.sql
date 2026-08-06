INSERT INTO site_settings(key,value,updated_at)
VALUES(
  'page_content:zh:/:home.hero.title',
  '专业处理全美交通罚单与相关事务，
为您的合法权益保驾护航',
  CURRENT_TIMESTAMP
)
ON CONFLICT(key) DO UPDATE SET
  value=excluded.value,
  updated_at=CURRENT_TIMESTAMP;
