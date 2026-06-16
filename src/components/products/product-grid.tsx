// Ürün grid'i — server component, ProductCard'ları listeler ya da boş durum gösterir
import Link from "next/link";
import { PackageSearch } from "lucide-react";
import type { ProductWithCategory } from "@/types";
import ProductCard from "@/components/home/product-card";

interface ProductGridProps {
  products: ProductWithCategory[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  // Ürün bulunamadı durumu
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center text-muted-foreground">
        <PackageSearch className="size-12 opacity-40" />
        <div>
          <p className="text-base font-medium text-foreground">
            Ürün bulunamadı
          </p>
          <p className="mt-1 text-sm">
            Arama kriterlerinizi değiştirmeyi deneyin.
          </p>
        </div>
        <Link
          href="/products"
          className="text-sm text-primary underline-offset-4 hover:underline"
        >
          Filtreleri Temizle
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
