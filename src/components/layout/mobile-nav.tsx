"use client";

// Mobil hamburger menüsü — sağdan açılan Sheet paneli
import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LogoutButton } from "@/components/auth/logout-button";

interface MobileNavProps {
  isLoggedIn: boolean;
  user: { id: number; name: string; email: string; role: "user" | "admin" } | null;
}

export default function MobileNav({ isLoggedIn, user }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  // Linke tıklanınca Sheet'i kapat
  function close() {
    setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {/* Hamburger butonu — sadece mobilde görünür */}
      <SheetTrigger asChild>
        <button
          className="md:hidden rounded-md p-1.5 text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
          aria-label="Menüyü aç"
        >
          <Menu className="size-5" />
        </button>
      </SheetTrigger>

      <SheetContent side="right" className="w-72 p-0 pt-10">
        {/* Navigasyon linkleri */}
        <nav className="flex flex-col gap-1 px-4 pb-4">
          <Link
            href="/"
            onClick={close}
            className="rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
          >
            Ana Sayfa
          </Link>
          <Link
            href="/products"
            onClick={close}
            className="rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
          >
            Ürünler
          </Link>
        </nav>

        <Separator />

        {/* Kullanıcı alanı */}
        <div className="flex flex-col gap-2 px-4 pt-4 pb-4">
          {isLoggedIn && user ? (
            <>
              {/* Kullanıcı adı */}
              <p className="px-3 pb-1 text-base font-semibold">{user.name}</p>

              <Link
                href="/orders"
                onClick={close}
                className="rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
              >
                Siparişlerim
              </Link>
              <Link
                href="/profile"
                onClick={close}
                className="rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
              >
                Profilim
              </Link>

              <div className="mt-1">
                <LogoutButton />
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <Button asChild onClick={close}>
                <Link href="/login">Giriş Yap</Link>
              </Button>
              <Button variant="outline" asChild onClick={close}>
                <Link href="/register">Kayıt Ol</Link>
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
