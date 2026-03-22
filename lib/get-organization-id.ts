/**
 * ログインユーザーに紐づく organization_id を取得する。
 *
 * 【現在】仮で "1" を返す。
 * 【将来】Supabase Auth のセッション（cookies）から user を取得し、
 * user.user_metadata.organization_id または users テーブルから取得する。
 *
 * @example 将来の実装イメージ
 * const supabase = createServerClient(cookies);
 * const { data: { user } } = await supabase.auth.getUser();
 * return user?.user_metadata?.organization_id ?? null;
 */
export async function getOrganizationId(
  _request?: Request
): Promise<string | null> {
  // 仮実装: 固定値
  return "1";
}
