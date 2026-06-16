"use client";

// Sepet sayfasının client tarafı — localStorage'dan items okuyup DB'den ürün detaylarını çeker
import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { getCartProducts, type CartProductItem } from "@/lib/actions/cart";
import { Button } from "@/components/ui/button";
import CartItemRow from "@/components/cart/cart-item-row";

function formatPrice(price: number): string {
  return (
    new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 }).format(
      price
    ) + " ₺"
  );
}

export default function CartPageClient() {
  const { items, getItemCount } = useCart();
  const [cartProducts, setCartProducts] = useState<CartProductItem[]>([]);
  const [loading, setLoading] = useState(false);

  // items değiştiğinde (ekleme/çıkarma/miktar güncelleme) DB'den ürün detaylarını getir
  useEffect(() => {
    if (items.length === 0) {
      setCartProducts([]);
      return;
    }

    setLoading(true);
    getCartProducts(items)
      .then(setCartProducts)
      .finally(() => setLoading(false));
  }, [items]);

  // Sepet boş
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center text-muted-foreground">
        <ShoppingBag className="size-14 opacity-40" />
        <div>
          <p className="text-base font-medium text-foreground">
            Sepetiniz boş
          </p>
          <p className="mt-1 text-sm">
            Ürün eklemek için alışverişe başlayın.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/products">Alışverişe Başla</Link>
        </Button>
      </div>
    );
  }

  // Ürünler yüklenirken basit bekleme metni
  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <div
            key={item.productId}
            className="h-28 animate-pulse rounded-xl bg-muted"
          />
        ))}
      </div>
    );
  }

  const subtotal = cartProducts.reduce(
    (sum, { product, quantity }) => sum + product.price * quantity,
    0
  );
  const totalCount = getItemCount();

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
      {/* Ürün listesi */}
      <div className="flex flex-1 flex-col gap-3">
        {cartProducts.map(({ product, quantity }) => (
          <CartItemRow key={product.id} product={product} quantity={quantity} />
        ))}
      </div>

      {/* Sipariş özeti */}
      <div className="w-full shrink-0 rounded-xl border border-border bg-card p-6 lg:w-80">
        <h2 className="mb-4 text-base font-semibold">Sipariş Özeti</h2>

        <div className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Ürün sayısı</span>
            <span className="font-medium">{totalCount} adet</span>
          </div>
          <div className="flex justify-between border-t border-border pt-2 text-base">
            <span className="font-semibold">Ara Toplam</span>
            <span className="font-bold text-primary">
              {formatPrice(subtotal)}
            </span>
          </div>
        </div>

        <Button asChild size="lg" className="mt-6 w-full">
          <Link href="/checkout">Siparişe Geç</Link>
        </Button>

        <Link
          href="/products"
          className="mt-3 block text-center text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          Alışverişe Devam Et
        </Link>
      </div>
    </div>
  );
}
