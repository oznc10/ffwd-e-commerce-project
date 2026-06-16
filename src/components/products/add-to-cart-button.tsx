"use client";

// Ürün detay sayfasında kullanılan sepete ekle bileşeni
import { useState } from "react";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";

interface AddToCartButtonProps {
  productId: number;
  stock: number;
}

export default function AddToCartButton({
  productId,
  stock,
}: AddToCartButtonProps) {
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const [quantity, setQuantity] = useState(1);

  // Stok yoksa yalnızca disabled buton göster
  if (stock === 0) {
    return (
      <Button size="lg" disabled className="w-full sm:w-auto">
        Stokta Yok
      </Button>
    );
  }

  const inCart = isInCart(productId);
  const cartQuantity = getItemQuantity(productId);

  function decrement() {
    setQuantity((q) => Math.max(1, q - 1));
  }

  function increment() {
    setQuantity((q) => Math.min(stock, q + 1));
  }

  function handleAddToCart() {
    addToCart(productId, quantity);
    setQuantity(1);
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Miktar seçici */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-muted-foreground">
          Miktar
        </span>
        <div className="flex items-center rounded-lg border border-border">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={decrement}
            disabled={quantity <= 1}
            aria-label="Miktarı azalt"
          >
            <Minus />
          </Button>

          <span className="w-10 text-center text-sm font-medium tabular-nums">
            {quantity}
          </span>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={increment}
            disabled={quantity >= stock}
            aria-label="Miktarı artır"
          >
            <Plus />
          </Button>
        </div>
      </div>

      {/* Sepete Ekle butonu */}
      <Button
        size="lg"
        onClick={handleAddToCart}
        className={
          inCart
            ? "w-full bg-green-600 hover:bg-green-700 sm:w-auto"
            : "w-full sm:w-auto"
        }
      >
        <ShoppingCart />
        {inCart ? `Sepette (${cartQuantity} adet)` : "Sepete Ekle"}
      </Button>
    </div>
  );
}
