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
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <nav className="flex items-center space-x-4 lg:space-x-6">
            <Link
               href="/eventos"
               className="text-sm font-medium transition-colors hover:text-primary"
             >
               Eventos
             </Link>
            {/* Acá más adelante podés agregar 'Bares' */}
          </nav>
        </div>
      </header>
      <main className="flex-1 container py-6">{children}</main>
    </div>
  );
}
