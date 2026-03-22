import Link from "next/link";
import { RecordsTable } from "@/components/records-table";
import type { RecordListApiItem } from "@/types";

export const dynamic = "force-dynamic";

async function getRecords(): Promise<
  | { ok: true; records: RecordListApiItem[] }
  | { ok: false; records: []; error: string }
> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ??
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000");
    const res = await fetch(`${baseUrl}/api/records`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    const data = await res.json();

    if (!res.ok) {
      const msg =
        typeof data?.error === "string" ? data.error : "一覧の取得に失敗しました。";
      return { ok: false, records: [], error: msg };
    }

    const records = Array.isArray(data) ? data : [];
    return { ok: true, records };
  } catch (err) {
    const msg =
      err instanceof Error ? err.message : "予期しないエラーが発生しました。";
    return { ok: false, records: [], error: msg };
  }
}

export default async function RecordsPage() {
  const result = await getRecords();

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">記録一覧</h1>
        <div className="flex gap-2">
          <Link
            href="/records/new"
            className="rounded-lg border border-accent bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-700"
          >
            新規作成
          </Link>
          <Link
            href="/"
            className="rounded-lg border border-line bg-white px-4 py-2 text-sm font-medium text-ink transition hover:bg-slate-50"
          >
            トップへ戻る
          </Link>
        </div>
      </div>

      {!result.ok ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-800">
          <p className="font-medium">記録一覧を表示できません</p>
          <p className="mt-2 text-sm">{result.error}</p>
        </div>
      ) : result.records.length === 0 ? (
        <div className="rounded-xl border border-line bg-white p-12 text-center text-slate-600">
          <p className="font-medium text-slate-700">記録がありません</p>
          <p className="mt-2 text-sm text-slate-500">
            <Link href="/records/new" className="text-accent underline">
              新規作成
            </Link>
            から記録を追加してください。
          </p>
        </div>
      ) : (
        <RecordsTable records={result.records} />
      )}
    </main>
  );
}
