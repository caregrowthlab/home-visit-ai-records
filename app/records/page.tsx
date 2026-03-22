import { RecordsPageClient } from "./records-page-client";

export const dynamic = "force-dynamic";

export default function RecordsPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <RecordsPageClient />
    </main>
  );
}
