// Ürün detay sayfası yüklenirken gösterilen skeleton
export default function ProductDetailLoading() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* Geri linki skeleton */}
      <div className="mb-8 h-5 w-28 animate-pulse rounded-md bg-muted" />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Sol: Görsel skeleton */}
        <div className="flex flex-col gap-4">
          <div className="aspect-[4/3] w-full animate-pulse rounded-xl bg-muted" />
          <div className="h-5 w-32 animate-pulse rounded-full bg-muted" />
        </div>

        {/* Sağ: Bilgi alanı skeleton */}
        <div className="flex flex-col gap-6">
          {/* Başlık */}
          <div className="flex flex-col gap-2">
            <div className="h-8 w-3/4 animate-pulse rounded-md bg-muted" />
            <div className="h-8 w-1/2 animate-pulse rounded-md bg-muted" />
          </div>

          {/* Fiyat */}
          <div className="h-10 w-36 animate-pulse rounded-md bg-muted" />

          {/* Badge */}
          <div className="h-5 w-24 animate-pulse rounded-full bg-muted" />

          {/* Açıklama */}
          <div className="flex flex-col gap-2">
            <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
            <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
            <div className="h-4 w-2/3 animate-pulse rounded-md bg-muted" />
          </div>

          {/* Stok */}
          <div className="h-4 w-32 animate-pulse rounded-md bg-muted" />

          {/* Buton */}
          <div className="h-10 w-40 animate-pulse rounded-lg bg-muted" />
        </div>
      </div>
    </main>
  );
}
