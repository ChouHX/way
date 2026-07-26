PRAGMA foreign_keys = ON;

-- “其他”代表没有更具体的类型，因此统一存为 NULL，由所属大类承接。
INSERT INTO case_categories (id, slug, name_zh, name_en, sort_order)
VALUES ('other', 'other', '其他', 'Other', 999)
ON CONFLICT(id) DO UPDATE SET
  name_zh = excluded.name_zh,
  name_en = excluded.name_en,
  sort_order = excluded.sort_order;

UPDATE case_studies
SET category_id = 'other', type_id = NULL, updated_at = CURRENT_TIMESTAMP
WHERE type_id IN (
  SELECT id FROM case_types
  WHERE LOWER(TRIM(name_en)) = 'other' OR TRIM(name_zh) = '其他'
);

UPDATE guides
SET type_id = NULL, updated_at = CURRENT_TIMESTAMP
WHERE type_id IN (
  SELECT id FROM case_types
  WHERE LOWER(TRIM(name_en)) = 'other' OR TRIM(name_zh) = '其他'
);

DELETE FROM case_types
WHERE LOWER(TRIM(name_en)) = 'other' OR TRIM(name_zh) = '其他';
