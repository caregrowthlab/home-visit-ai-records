-- records テーブル作成
CREATE TABLE IF NOT EXISTS records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id TEXT,
  visit_date DATE,
  input_text TEXT NOT NULL,
  ai_output TEXT DEFAULT '',
  final_text TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS を有効化（publishable key / anon key 前提）
ALTER TABLE records ENABLE ROW LEVEL SECURITY;

-- anon ロールで insert / select を許可（publishable key 用）
CREATE POLICY "records_insert" ON records FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "records_select" ON records FOR SELECT TO anon USING (true);
