// Global 404 sayfası — bulunamayan tüm rotalar buraya düşer
import Link from "next/link";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <SearchX className="size-16 text-muted-foreground opacity-40" />

      <div className="flex flex-col gap-2">
        <p className="text-8xl font-black tracking-tighter text-muted-foreground/30">
          404
        </p>
        <h1 className="text-2xl font-bold tracking-tight">
          Sayfa Bulunamadı
        </h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          Aradığınız sayfa mevcut değil veya taşınmış olabilir.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button asChild>
          <Link href="/">Ana Sayfaya Dön</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/products">Ürünleri Gör</Link>
        </Button>
      </div>
    </main>
  );
}
