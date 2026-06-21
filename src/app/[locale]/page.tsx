// Ana sayfa — server component, veritabanından veri çeker
import type { Metadata } from "next";
import { getFeaturedProducts, getAllCategories } from "@/lib/products";

export const metadata: Metadata = {
  title: "TechStore | Teknolojinin En İyileri",
  description: "En güncel teknoloji ürünleri tek bir yerde",
};
import HeroSection from "@/components/home/hero-section";
import CategoryCard from "@/components/home/category-card";
import ProductCard from "@/components/home/product-card";

export default function HomePage() {
  const categories = getAllCategories();
  const featuredProducts = getFeaturedProducts();

  return (
    <main className="flex-1">
      {/* Hero banner */}
      <HeroSection />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Kategoriler bölümü */}
        <section className="py-16">
          <h2 className="mb-8 text-2xl font-bold tracking-tight">
            Kategoriler
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </section>

        {/* Öne çıkan ürünler bölümü */}
        <section className="py-16 border-t border-border">
          <h2 className="mb-8 text-2xl font-bold tracking-tight">
            Öne Çıkan Ürünler
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
