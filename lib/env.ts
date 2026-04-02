/**
 * 環境変数
 * Supabase（publishable key / anon key）・OpenAI 用
 */

export function getEnv() {
  return {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    openAiApiKey: process.env.OPENAI_API_KEY ?? "",
  };
}

/** Supabase 用: publishable key（anon key）のみ使用 */
export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (url === undefined || url === "") {
    console.error("[Supabase] NEXT_PUBLIC_SUPABASE_URL が未設定または空です");
    throw new Error(
      "Supabase の環境変数が設定されていません。NEXT_PUBLIC_SUPABASE_URL を設定してください。"
    );
  }

  if (!key || key.trim() === "") {
    console.error("[Supabase] NEXT_PUBLIC_SUPABASE_ANON_KEY が未設定または空です");
    throw new Error(
      "Supabase の環境変数が設定されていません。NEXT_PUBLIC_SUPABASE_ANON_KEY（publishable key）を設定してください。"
    );
  }

  console.log("[Supabase] supabaseUrl:", url);
  console.log("[Supabase] supabaseAnonKey (先頭5文字):", key.slice(0, 5) + "***");

  return { url, key };
}

export type OpenAIEnv = {
  apiKey: string;
  model: string;
  /** 組織に複数プロジェクトがある場合など（任意） */
  organization?: string;
  /** sk-proj- キー利用時は必須になることが多い */
  project?: string;
};

/** OpenAI 用: APIキー・プロジェクトID 等（前後の空白は除去） */
export function getOpenAIEnv(): OpenAIEnv {
  const raw = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
  const organization = process.env.OPENAI_ORG_ID?.trim() || undefined;
  const project = process.env.OPENAI_PROJECT_ID?.trim() || undefined;

  const key = raw?.trim() ?? "";
  if (!key) {
    throw new Error(
      "OpenAI の環境変数が設定されていません。プロジェクト直下の .env.local に OPENAI_API_KEY を設定し、開発サーバーを再起動してください。"
    );
  }

  if (!key.startsWith("sk-")) {
    console.warn(
      "[OpenAI] OPENAI_API_KEY は通常 sk- で始まります。値のコピー漏れや別の値が入っていないか確認してください。"
    );
  }

  if (key.startsWith("sk-proj") && !project) {
    console.warn(
      "[OpenAI] sk-proj- で始まるキーはプロジェクトに紐づきます。.env.local に OPENAI_PROJECT_ID を追加してください（platform.openai.com → 該当プロジェクト → Settings → General）。"
    );
  }

  return { apiKey: key, model, organization, project };
}
