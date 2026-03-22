export default function RecordsLoading() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="h-8 w-32 animate-pulse rounded bg-slate-200" />
        <div className="flex gap-2">
          <div className="h-10 w-24 animate-pulse rounded-lg bg-slate-200" />
          <div className="h-10 w-24 animate-pulse rounded-lg bg-slate-200" />
        </div>
      </div>
      <div className="animate-pulse space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-14 rounded-xl border border-line bg-white"
            style={{ animationDelay: `${i * 50}ms` }}
          />
        ))}
      </div>
      <p className="mt-6 text-center text-sm text-slate-500">
        読み込み中...
      </p>
    </main>
  );
}
