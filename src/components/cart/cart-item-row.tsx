"use client";

// Sepet sayfasındaki tek bir ürün satırı
// React.memo: aynı ürün/miktar geldiğinde yeniden render önlenir
import React from "react";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import type { ProductWithCategory } from "@/types";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils/format";

interface CartItemRowProps {
  product: ProductWithCategory;
  quantity: number;
}

const CartItemRow = React.memo(function CartItemRow({ product, quantity }: CartItemRowProps) {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
      {/* Ürün görseli */}
      <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-muted">
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          className="object-cover"
          sizes="80px"
        />
      </div>

      {/* Ürün bilgileri */}
      <div className="flex-1 min-w-0">
        <p className="font-medium leading-snug line-clamp-2">{product.name}</p>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {product.category_name}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Birim: {formatPrice(product.price)}
        </p>
      </div>

      {/* Miktar + toplam + sil */}
      <div className="flex shrink-0 flex-col items-end gap-3">
        {/* Miktar güncelleme */}
        <div className="flex items-center rounded-lg border border-border">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => updateQuantity(product.id, quantity - 1)}
            aria-label="Miktarı azalt"
          >
            <Minus />
          </Button>
          <span className="w-8 text-center text-sm font-medium tabular-nums">
            {quantity}
          </span>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => updateQuantity(product.id, quantity + 1)}
            disabled={quantity >= product.stock}
            aria-label="Miktarı artır"
          >
            <Plus />
          </Button>
        </div>

        {/* Toplam fiyat */}
        <p className="text-base font-bold">
          {formatPrice(product.price * quantity)}
        </p>

        {/* Sil butonu */}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => removeFromCart(product.id)}
          className="text-muted-foreground hover:text-destructive"
          aria-label="Ürünü sepetten kaldır"
        >
          <Trash2 />
        </Button>
      </div>
    </div>
  );
});

export default CartItemRow;
