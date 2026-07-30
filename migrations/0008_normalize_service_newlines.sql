UPDATE services
SET
  overview_zh = replace(replace(overview_zh, '\r\n', char(10)), '\n', char(10)),
  overview_en = replace(replace(overview_en, '\r\n', char(10)), '\n', char(10)),
  updated_at = CURRENT_TIMESTAMP
WHERE instr(overview_zh, '\n') > 0
   OR instr(overview_en, '\n') > 0;
