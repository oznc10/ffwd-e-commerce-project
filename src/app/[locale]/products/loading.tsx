// Ürünler listesi yüklenirken gösterilen skeleton
export default function ProductsLoading() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* Başlık + filtreler skeleton */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="h-8 w-36 animate-pulse rounded-md bg-muted" />
        <div className="h-10 w-48 animate-pulse rounded-md bg-muted" />
      </div>

      {/* Arama çubuğu skeleton */}
      <div className="mb-8 h-10 w-full animate-pulse rounded-md bg-muted" />

      {/* 12 ürün kartı skeleton */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col overflow-hidden rounded-xl border border-border bg-card"
          >
            {/* Görsel alanı */}
            <div className="aspect-square animate-pulse bg-gray-200" />
            {/* İçerik alanı */}
            <div className="flex flex-col gap-2 p-4">
              <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200" />
              <div className="mt-2 h-5 w-1/3 animate-pulse rounded bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
