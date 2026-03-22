-- 既存の汎用ポリシーを削除
DROP POLICY IF EXISTS "Allow all for now" ON records;

-- anon ロールで insert / select を許可（publishable key 用）
CREATE POLICY "records_insert" ON records FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "records_select" ON records FOR SELECT TO anon USING (true);
