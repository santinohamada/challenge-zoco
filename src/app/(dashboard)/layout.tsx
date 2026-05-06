import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dashboard - Zoco Tucumán",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50/50">
      <header className="sticky top-0 z-10 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          <nav className="flex items-center space-x-6">
            <Link
              href="/"
              className="text-sm font-semibold transition-colors hover:text-zinc-900 text-zinc-400"
            >
              ← Inicio
            </Link>
            <Link
              href="/eventos"
              className="text-sm font-semibold transition-colors hover:text-zinc-900 text-zinc-600"
            >
              Eventos
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
