# 訪問看護AI記録アプリ MVP

Next.js App Router、Supabase、OpenAI API を使った訪問看護記録生成アプリのMVPです。

## 実装範囲

- ログイン画面
- ホーム画面
- 記録入力画面
- 履歴一覧画面
- `DAR` 生成
- 医師向け情報提供書生成
- 生成結果の編集とコピー
- `records` テーブルへの保存
- 履歴検索と再編集

## セットアップ

1. Node.js 20 以上をインストール
2. 依存関係をインストール

```bash
npm install
```

3. `.env.example` を `.env.local` にコピーして値を設定

```bash
cp .env.example .env.local
```

4. Supabase にマイグレーションを適用
   - `supabase/migrations/20250321000000_create_records.sql` を SQL エディタで実行
   - 既にテーブルがある場合は `20250321000001_rls_anon_only.sql`、`20250321000002_add_visit_date.sql`、`20250321000003_records_update_policy.sql`、`20250321000004_add_previous_record_prompt_type.sql` も実行
5. 開発サーバーを起動

```bash
npm run dev
```

## 必要な環境変数

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`（publishable key）
- `OPENAI_API_KEY`
- `OPENAI_MODEL` 任意。既定値は `gpt-4.1-mini`

## API

- `GET /api/records` … 記録一覧取得
- `POST /api/records` … 新規保存（`input_text` 必須、`previous_record`, `ai_output`, `final_text`, `prompt_type`、任意 `organization_id`）
- `PATCH /api/records/[id]` … 部分更新（`final_text` のみでも可。フォーム保存時は `previous_record`, `input_text`, `ai_output`, `final_text`, `prompt_type` をまとめて送る想定）
- `POST /api/generate` … AI下書き生成（`previous_record` 任意、`input_text` 必須、互換で `current_input` 可、`prompt_type`: `dar` | `soap`）→ `{ ai_output }`
- `POST /api/revise` … 修正指示で再調整（body: `ai_output`, `instruction`, `prompt_type`）→ `{ revised_output }`

## 補足

- 保存APIは publishable key（anon key）のみ使用し、RLS で insert / select を許可しています。
- **INSERT が失敗する場合**: Supabase SQL で `CREATE POLICY "records_insert" ON records FOR INSERT TO anon WITH CHECK (true);` が存在するか確認。サーバーログに `[api/records POST]` が出ます。
- この環境では Node.js が未導入のため、`npm install` と `npm run dev` は未実行です。
