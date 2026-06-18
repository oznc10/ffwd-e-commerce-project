// Tek ürün kartı — ürün listesi ve öne çıkan ürünler bölümünde kullanılır
// React.memo: props değişmediğinde gereksiz yeniden render önlenir
import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { ProductWithCategory } from "@/types";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: ProductWithCategory;
}

// Fiyatı Türk Lirası formatına çevir: 54999 → "54.999 ₺"
function formatPrice(price: number): string {
  return (
    new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 }).format(price) +
    " ₺"
  );
}

const ProductCard = React.memo(function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden p-0 gap-0">
      {/* Ürün görseli */}
      <div className="relative h-48 w-full bg-muted">
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
      </div>

      <CardContent className="flex flex-col gap-2 pt-4 flex-1">
        {/* Kategori badge */}
        <Badge variant="secondary" className="w-fit">
          {product.category_name}
        </Badge>

        {/* Ürün adı */}
        <p className="font-semibold leading-snug line-clamp-2">{product.name}</p>

        {/* Fiyat */}
        <p className="text-lg font-bold text-primary">
          {formatPrice(product.price)}
        </p>

        {/* Stok durumu */}
        {product.stock === 0 ? (
          <Badge variant="destructive" className="w-fit">
            Stokta Yok
          </Badge>
        ) : (
          <Badge variant="outline" className="w-fit text-green-600 border-green-200 bg-green-50">
            Stokta Var
          </Badge>
        )}
      </CardContent>

      <CardFooter className="border-t-0 bg-transparent pt-0 pb-4 px-4">
        <Button asChild className="w-full" size="sm">
          <Link href={`/products/${product.id}`}>İncele</Link>
        </Button>
      </CardFooter>
    </Card>
  );
});

export default ProductCard;
