// Ana sayfa hero banner'ı — büyük tanıtım alanı
import Link from "next/link";
import { Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="bg-gray-900 text-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col items-center text-center gap-8">
        {/* Üst etiket */}
        <span className="inline-flex items-center gap-1.5 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-3 py-1 text-sm text-yellow-400">
          <Zap className="size-3.5" />
          Yeni sezon ürünleri geldi
        </span>

        {/* Ana başlık */}
        <h1 className="max-w-2xl text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
          Teknolojinin En İyileri
        </h1>

        {/* Alt başlık */}
        <p className="max-w-xl text-lg text-gray-400">
          MacBook, iPhone, aksesuar ve daha fazlası — en güncel teknoloji
          ürünleri tek bir yerde.
        </p>

        {/* Aksiyon butonları */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" asChild>
            <Link href="/products" className="flex items-center gap-2">
              Ürünleri Keşfet
              <ArrowRight className="size-4" />
            </Link>
          </Button>

          <Button
            size="lg"
            asChild
            className="border border-white text-white hover:bg-white hover:text-gray-900"
          >
            <Link href="/products?sortBy=price_asc">Fırsatları Gör</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
