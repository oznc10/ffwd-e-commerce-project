// Auth route grubu için layout — giriş ve kayıt sayfalarını sarar
import Link from "next/link";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/40 flex flex-col items-center justify-center p-4">
      {/* Site logosu */}
      <Link
        href="/"
        className="mb-8 text-2xl font-bold tracking-tight text-foreground hover:opacity-80 transition-opacity"
      >
        TechStore
      </Link>

      {/* Sayfa içeriği beyaz kart içinde */}
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
