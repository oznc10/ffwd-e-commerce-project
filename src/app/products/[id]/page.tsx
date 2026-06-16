// Ürün detay sayfası — server component
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getProductById } from "@/lib/products";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Next.js 16'da params bir Promise; async component ile await edilmeli
export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProductById(Number(id));

  // Ürün bulunamazsa Next.js'in not-found sayfasını göster
  if (!product) {
    notFound();
  }

  const isOutOfStock = product.stock === 0;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* Geri linki */}
      <Link
        href="/products"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        Ürünlere Dön
      </Link>

      {/* İki kolon layout */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Sol: Görsel + Kategori */}
        <div className="flex flex-col gap-4">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-muted">
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <Badge variant="secondary" className="w-fit">
            {product.category_name}
          </Badge>
        </div>

        {/* Sağ: Ürün bilgileri */}
        <div className="flex flex-col gap-6">
          {/* Başlık */}
          <h1 className="text-3xl font-bold leading-tight tracking-tight">
            {product.name}
          </h1>

          {/* Fiyat */}
          <p className="text-4xl font-bold text-primary">
            {formatPrice(product.price)}
          </p>

          {/* Stok durumu badge'i */}
          {isOutOfStock ? (
            <Badge variant="destructive" className="w-fit">
              Stokta Yok
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="w-fit border-green-200 bg-green-50 text-green-700"
            >
              Stokta Var
            </Badge>
          )}

          {/* Açıklama */}
          <p className="leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          {/* Stok adedi */}
          {!isOutOfStock && (
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">
                {product.stock} adet
              </span>{" "}
              stokta
            </p>
          )}

          {/* Sepete Ekle — Faz 5'te aktif edilecek */}
          <Button size="lg" disabled className="w-full sm:w-auto">
            {isOutOfStock ? "Stokta Yok" : "Yakında"}
          </Button>
        </div>
      </div>
    </main>
  );
}

// Fiyatı Türk Lirası formatına çevir: 54999 → "54.999 ₺"
function formatPrice(price: number): string {
  return (
    new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 }).format(
      price
    ) + " ₺"
  );
}
