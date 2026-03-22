import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "@/lib/env";

let serverClient: SupabaseClient | null = null;

/**
 * Supabase クライアント（publishable key / anon key 使用、RLS 前提）
 */
export function getSupabase(): SupabaseClient {
  if (!serverClient) {
    const { url, key } = getSupabaseEnv();
    serverClient = createClient(url, key);
  }
  return serverClient;
}
