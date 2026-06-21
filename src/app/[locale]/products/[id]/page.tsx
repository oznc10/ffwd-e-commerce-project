// Ürün detay sayfası — server component
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getProductById } from "@/lib/products";
import { getSession } from "@/lib/session";
import {
  getProductReviews,
  getProductRatingStats,
  hasUserReviewed,
} from "@/lib/actions/review";
import { Badge } from "@/components/ui/badge";
import AddToCartButton from "@/components/products/add-to-cart-button";
import RatingSummary from "@/components/reviews/rating-summary";
import ReviewForm from "@/components/reviews/review-form";
import ReviewList from "@/components/reviews/review-list";

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

  // Yorum verileri + oturum bilgisi paralel çekiliyor
  const [ratingStats, reviews, session, alreadyReviewed] = await Promise.all([
    getProductRatingStats(product.id),
    getProductReviews(product.id),
    getSession(),
    hasUserReviewed(product.id),
  ]);

  const isOutOfStock = product.stock === 0;
  const isLoggedIn = session.isLoggedIn;

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

          {/* Puan özeti */}
          <RatingSummary
            average={ratingStats.average}
            count={ratingStats.count}
          />

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

          {/* Sepete Ekle */}
          <AddToCartButton productId={product.id} stock={product.stock} />
        </div>
      </div>

      {/* Değerlendirmeler bölümü */}
      <section className="mt-16 border-t border-border pt-10">
        <h2 className="mb-6 text-xl font-bold tracking-tight">
          Değerlendirmeler
        </h2>

        {/* Yorum formu veya bilgi mesajı */}
        <div className="mb-8">
          {isLoggedIn ? (
            alreadyReviewed ? (
              <p className="rounded-md bg-muted px-4 py-3 text-sm text-muted-foreground">
                Bu ürüne zaten değerlendirme yaptınız.
              </p>
            ) : (
              <ReviewForm productId={product.id} />
            )
          ) : (
            <p className="rounded-md bg-muted px-4 py-3 text-sm text-muted-foreground">
              Yorum yapmak için{" "}
              <Link
                href="/login"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                giriş yapın
              </Link>
              .
            </p>
          )}
        </div>

        {/* Yorum listesi */}
        <ReviewList reviews={reviews} />
      </section>
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
