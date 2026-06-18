// Tek kategori kartı — kategoriye tıklandığında filtreli ürün listesine gider
// React.memo: props değişmediğinde gereksiz yeniden render önlenir
import React from "react";
import Link from "next/link";
import type { Category } from "@/types";

// Kategori slug'ına göre emoji belirle
function getCategoryEmoji(slug: string): string {
  switch (slug) {
    case "bilgisayar-laptop":
      return "💻";
    case "telefon-tablet":
      return "📱";
    case "aksesuar-cevre-birimleri":
      return "🎧";
    default:
      return "📦";
  }
}

interface CategoryCardProps {
  category: Category;
}

const CategoryCard = React.memo(function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/products?category=${category.slug}`}
      className="group flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-8 text-center transition-all hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5"
    >
      {/* Emoji ikonu */}
      <span className="flex size-16 items-center justify-center rounded-full bg-muted text-3xl transition-transform group-hover:scale-110">
        {getCategoryEmoji(category.slug)}
      </span>

      {/* Kategori adı */}
      <div>
        <p className="font-semibold text-foreground">{category.name}</p>
        {category.description && (
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {category.description}
          </p>
        )}
      </div>
    </Link>
  );
});

export default CategoryCard;
