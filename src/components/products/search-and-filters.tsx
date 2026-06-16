"use client";

// Ürün listesi arama ve filtre paneli — URL parametrelerini günceller
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { Category } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterParams {
  search?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  sortBy?: string;
}

interface SearchAndFiltersProps {
  categories: Category[];
  searchParams: FilterParams;
}

// Mevcut filtre state'inden URL parametrelerini oluştur ve yönlendir
// patch ile değişen tek değeri geçersiz kılabiliriz (setState async olduğu için)
function buildUrl(
  pathname: string,
  current: FilterParams,
  patch: Partial<FilterParams> = {}
): string {
  const merged = { ...current, ...patch };
  const params = new URLSearchParams();

  if (merged.search) params.set("search", merged.search);
  if (merged.category && merged.category !== "all")
    params.set("category", merged.category);
  if (merged.minPrice) params.set("minPrice", merged.minPrice);
  if (merged.maxPrice) params.set("maxPrice", merged.maxPrice);
  if (merged.sortBy && merged.sortBy !== "newest")
    params.set("sortBy", merged.sortBy);
  // Filtre değişince sayfa 1'e dön
  params.delete("page");

  const qs = params.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

export default function SearchAndFilters({
  categories,
  searchParams,
}: SearchAndFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();

  // URL parametrelerinden başlangıç değerleri
  const [search, setSearch] = useState(searchParams.search ?? "");
  const [categorySlug, setCategorySlug] = useState(
    searchParams.category ?? "all"
  );
  const [minPrice, setMinPrice] = useState(searchParams.minPrice ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.maxPrice ?? "");
  const [sortBy, setSortBy] = useState(searchParams.sortBy ?? "newest");

  // searchParams prop değişince (sayfa yeniden yüklenince) state'i güncelle
  useEffect(() => {
    setSearch(searchParams.search ?? "");
    setCategorySlug(searchParams.category ?? "all");
    setMinPrice(searchParams.minPrice ?? "");
    setMaxPrice(searchParams.maxPrice ?? "");
    setSortBy(searchParams.sortBy ?? "newest");
  }, [searchParams]);

  // Mevcut state snapshot'ını URL'e yaz
  const currentState: FilterParams = { search, category: categorySlug, minPrice, maxPrice, sortBy };

  function handleCategoryChange(value: string) {
    setCategorySlug(value);
    router.push(buildUrl(pathname, currentState, { category: value }));
  }

  function handleSortChange(value: string) {
    setSortBy(value);
    router.push(buildUrl(pathname, currentState, { sortBy: value }));
  }

  function handleMinPriceBlur() {
    router.push(buildUrl(pathname, currentState, { minPrice }));
  }

  function handleMaxPriceBlur() {
    router.push(buildUrl(pathname, currentState, { maxPrice }));
  }

  function handleSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      router.push(buildUrl(pathname, currentState, { search }));
    }
  }

  function handleClear() {
    setSearch("");
    setCategorySlug("all");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("newest");
    router.push(pathname);
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4">
      {/* Arama */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Arama</label>
        <Input
          placeholder="Ürün ara... (Enter'a bas)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleSearchKeyDown}
        />
      </div>

      {/* Kategori */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Kategori</label>
        <Select value={categorySlug} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Tüm Kategoriler" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tüm Kategoriler</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.slug}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Fiyat aralığı */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Fiyat Aralığı (₺)</label>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            onBlur={handleMinPriceBlur}
            min={0}
          />
          <Input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            onBlur={handleMaxPriceBlur}
            min={0}
          />
        </div>
      </div>

      {/* Sıralama */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Sıralama</label>
        <Select value={sortBy} onValueChange={handleSortChange}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">En Yeni</SelectItem>
            <SelectItem value="oldest">En Eski</SelectItem>
            <SelectItem value="price_asc">Fiyat: Düşükten Yükseğe</SelectItem>
            <SelectItem value="price_desc">Fiyat: Yüksekten Düşüğe</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Temizle */}
      <Button variant="outline" size="sm" onClick={handleClear}>
        Filtreleri Temizle
      </Button>
    </div>
  );
}
