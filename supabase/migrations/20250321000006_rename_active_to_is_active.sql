-- active → is_active に変更（既に適用済みの環境用。active が存在する場合のみ実行）
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'patients' AND column_name = 'active'
  ) THEN
    ALTER TABLE patients RENAME COLUMN active TO is_active;
  END IF;
END $$;
