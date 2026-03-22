-- anon ロールで update を許可（final_text 更新用）
CREATE POLICY "records_update" ON records FOR UPDATE TO anon
  USING (true)
  WITH CHECK (true);
