// Ürün listesi sayfası — server component, filtre ve sayfalama destekli
import type { Metadata } from "next";
import { getAllCategories, getProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Tüm Ürünler | TechStore",
  description: "MacBook, iPhone, aksesuar ve daha fazlası",
};
import type { GetProductsOptions } from "@/lib/products";
import SearchAndFilters from "@/components/products/search-and-filters";
import ProductGrid from "@/components/products/product-grid";
import Pagination from "@/components/products/pagination";

// Next.js 16'da searchParams bir Promise; async component ve await zorunlu
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  // String değer yardımcısı — dizi gelirse ilk elemanı al
  function str(val: string | string[] | undefined): string | undefined {
    if (!val) return undefined;
    return Array.isArray(val) ? val[0] : val;
  }

  const search = str(params.search);
  const categorySlug = str(params.category);
  const minPrice = Number(str(params.minPrice)) || undefined;
  const maxPrice = Number(str(params.maxPrice)) || undefined;
  const page = Number(str(params.page)) || 1;

  // sortBy değerini güvenli tiple doğrula
  const sortByRaw = str(params.sortBy);
  const VALID_SORT = ["newest", "oldest", "price_asc", "price_desc"] as const;
  const sortBy = VALID_SORT.includes(
    sortByRaw as (typeof VALID_SORT)[number]
  )
    ? (sortByRaw as GetProductsOptions["sortBy"])
    : "newest";

  const options: GetProductsOptions = {
    search,
    categorySlug,
    minPrice,
    maxPrice,
    sortBy,
    page,
    limit: 12,
  };

  // Veritabanı sorguları
  const categories = getAllCategories();
  const { products, total, totalPages } = getProducts(options);

  // SearchAndFilters'a geçilecek düz parametre nesnesi
  const filterParams = {
    search: str(params.search),
    category: str(params.category),
    minPrice: str(params.minPrice),
    maxPrice: str(params.maxPrice),
    sortBy: str(params.sortBy),
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* Sayfa başlığı */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Tüm Ürünler</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {total} ürün bulundu
        </p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        {/* Sol: Filtre paneli */}
        <aside className="w-full shrink-0 lg:w-64">
          <SearchAndFilters
            categories={categories}
            searchParams={filterParams}
          />
        </aside>

        {/* Sağ: Ürün grid'i + sayfalama */}
        <div className="flex-1">
          <ProductGrid products={products} />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            searchParams={params}
          />
        </div>
      </div>
    </main>
  );
}
