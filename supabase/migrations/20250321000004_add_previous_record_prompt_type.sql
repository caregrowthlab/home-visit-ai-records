-- 前回記録・記録形式をカラムで保持（フォーム保存用）
ALTER TABLE records ADD COLUMN IF NOT EXISTS previous_record TEXT NOT NULL DEFAULT '';
ALTER TABLE records ADD COLUMN IF NOT EXISTS prompt_type TEXT NOT NULL DEFAULT 'dar';

COMMENT ON COLUMN records.previous_record IS '前回訪問記録など（任意）';
COMMENT ON COLUMN records.prompt_type IS 'dar または soap';
