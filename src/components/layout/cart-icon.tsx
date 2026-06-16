"use client";

// Sepet ikonu — item sayısını canlı olarak gösterir
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/use-cart";

export default function CartIcon() {
  const { getItemCount } = useCart();
  const count = getItemCount();

  return (
    <Link
      href="/cart"
      aria-label={`Sepet${count > 0 ? ` (${count} ürün)` : ""}`}
      className="relative rounded-md p-1.5 text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
    >
      <ShoppingCart className="size-5" />

      {/* Sepet dolu ise kırmızı sayaç badge'i */}
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold leading-none text-white">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
