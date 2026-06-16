// Sepet sayfası yüklenirken gösterilen skeleton
export default function CartLoading() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* Başlık skeleton */}
      <div className="mb-8 h-8 w-32 animate-pulse rounded-md bg-muted" />

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        {/* Ürün satırları skeleton */}
        <div className="flex flex-1 flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-xl bg-muted"
            />
          ))}
        </div>

        {/* Özet kutusu skeleton */}
        <div className="w-full shrink-0 animate-pulse rounded-xl bg-muted lg:w-80 h-52" />
      </div>
    </main>
  );
}
