import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "訪問看護AI記録支援アプリ",
  description: "訪問看護の記録業務を支援するAIアプリケーション",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <header className="border-b border-line bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
            <p className="text-lg font-semibold text-ink">
              訪問看護AI記録支援アプリ
            </p>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
