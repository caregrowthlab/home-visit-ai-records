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

/** OpenAI 用: APIキー取得 */
export function getOpenAIEnv() {
  const key = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

  if (!key?.trim()) {
    throw new Error(
      "OpenAI の環境変数が設定されていません。OPENAI_API_KEY を設定してください。"
    );
  }

  return { apiKey: key, model };
}
