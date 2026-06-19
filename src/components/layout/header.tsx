// Site üst navigasyon çubuğu — server component, session durumuna göre içerik gösterir
import Link from "next/link";
import { Zap } from "lucide-react";
import { getSession, type SessionData } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/auth/logout-button";
import CartIcon from "@/components/layout/cart-icon";
import MobileNav from "@/components/layout/mobile-nav";
import ThemeToggle from "@/components/layout/theme-toggle";

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

        {/* Orta: Navigasyon — sadece md ve üstünde görünür */}
        <nav className="hidden md:flex items-center gap-1">
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

        {/* Sağ: Sepet + Kullanıcı alanı + Hamburger */}
        <div className="flex items-center gap-2">
          {/* Tema değiştirme butonu */}
          <ThemeToggle />

          {/* Sepet ikonu — item sayısını canlı gösterir */}
          <CartIcon />

          {/* Masaüstü kullanıcı alanı — sadece md ve üstünde görünür */}
          {session.isLoggedIn && session.user ? (
            <LoggedInArea user={session.user} />
          ) : (
            <GuestArea />
          )}

          {/* Mobil hamburger menü — sadece md altında görünür */}
          <MobileNav
            isLoggedIn={session.isLoggedIn}
            user={session.user ?? null}
          />
        </div>
      </div>
    </header>
  );
}

// Oturum açmış kullanıcı için masaüstü alanı
function LoggedInArea({ user }: { user: NonNullable<SessionData["user"]> }) {
  return (
    <div className="hidden md:flex items-center gap-2">
      <Link
        href="/profile"
        className="rounded-md px-3 py-1.5 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
      >
        {user.name}
      </Link>
      <Link
        href="/orders"
        className="rounded-md px-3 py-1.5 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
      >
        Siparişlerim
      </Link>
      <LogoutButton />
    </div>
  );
}

// Oturum açmamış ziyaretçi için masaüstü alanı
function GuestArea() {
  return (
    <div className="hidden md:flex items-center gap-2">
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
