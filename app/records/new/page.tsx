import Link from "next/link";
import { RecordForm } from "@/components/record-form";

export default function NewRecordPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">新規記録作成</h1>
        <Link
          href="/"
          className="rounded-lg border border-line bg-white px-4 py-2 text-sm font-medium text-ink transition hover:bg-slate-50"
        >
          トップへ戻る
        </Link>
      </div>
      <RecordForm />
    </main>
  );
}
