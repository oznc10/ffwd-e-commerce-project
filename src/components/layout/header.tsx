// Site üst navigasyon çubuğu — server component, session durumuna göre içerik gösterir
import Link from "next/link";
import { Zap, ShoppingCart } from "lucide-react";
import { getSession, type SessionData } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/auth/logout-button";

export default async function Header() {
  const session = await getSession();

  return (
    <header className="sticky top-0 z-50 bg-gray-900 text-white">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* Sol: Logo */}
        <Link
          href="/"
          className="flex items-center gap-1.5 text-lg font-bold tracking-tight hover:opacity-80 transition-opacity"
        >
          <Zap className="size-4 text-yellow-400" />
          TechStore
        </Link>

        {/* Orta: Navigasyon */}
        <nav className="hidden sm:flex items-center gap-1">
          <Link
            href="/"
            className="rounded-md px-3 py-1.5 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
          >
            Ana Sayfa
          </Link>
          <Link
            href="/products"
            className="rounded-md px-3 py-1.5 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
          >
            Ürünler
          </Link>
        </nav>

        {/* Sağ: Sepet + Kullanıcı alanı */}
        <div className="flex items-center gap-2">
          {/* Sepet ikonu — şimdilik statik */}
          <Link
            href="/cart"
            aria-label="Sepet"
            className="rounded-md p-1.5 text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
          >
            <ShoppingCart className="size-5" />
          </Link>

          {/* Oturum durumuna göre kullanıcı alanı */}
          {session.isLoggedIn && session.user ? (
            <LoggedInArea user={session.user} />
          ) : (
            <GuestArea />
          )}
        </div>
      </div>
    </header>
  );
}

// Oturum açmış kullanıcı için alan
function LoggedInArea({ user }: { user: NonNullable<SessionData["user"]> }) {
  return (
    <div className="flex items-center gap-2">
      <Link
        href="/profile"
        className="hidden sm:block rounded-md px-3 py-1.5 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
      >
        {user.name}
      </Link>
      <LogoutButton />
    </div>
  );
}

// Oturum açmamış ziyaretçi için alan
function GuestArea() {
  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/login" className="text-gray-300 hover:text-white">
          Giriş Yap
        </Link>
      </Button>
      <Button size="sm" asChild>
        <Link href="/register">Kayıt Ol</Link>
      </Button>
    </div>
  );
}
