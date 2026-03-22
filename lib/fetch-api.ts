/**
 * API が HTML（404/500 ページ）を返した場合の JSON パースエラーを防ぐ。
 * res.text() → JSON.parse → res.ok チェックの順で処理する。
 */
export async function fetchApi<T = unknown>(
  url: string,
  options?: RequestInit
): Promise<{ ok: true; data: T } | { ok: false; error: string }> {
  const res = await fetch(url, options);
  const text = await res.text();

  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    const preview = text.slice(0, 120).replace(/\s+/g, " ");
    console.error(
      `[fetchApi] JSONパース失敗 url=${url} status=${res.status} 本文先頭120文字:`,
      preview
    );
    throw new Error(
      `APIがJSONを返していません（${res.status}）: ${preview}${text.length > 120 ? "…" : ""}`
    );
  }

  if (!res.ok) {
    const errMsg =
      (data && typeof data === "object" && "error" in data && typeof (data as { error: unknown }).error === "string")
        ? (data as { error: string }).error
        : `APIエラー（${res.status}）`;
    return { ok: false, error: errMsg };
  }

  return { ok: true, data: data as T };
}
