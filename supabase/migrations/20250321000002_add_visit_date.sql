-- visit_date カラム追加
ALTER TABLE records ADD COLUMN IF NOT EXISTS visit_date DATE;
