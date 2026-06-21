// Ödeme sayfası yüklenirken gösterilen skeleton
export default function CheckoutLoading() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* Başlık */}
      <div className="mb-8 h-8 w-24 animate-pulse rounded-md bg-muted" />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        {/* Sol kolon */}
        <div className="flex flex-col gap-6">
          {/* Teslimat kartı */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-4 h-5 w-36 animate-pulse rounded-md bg-muted" />
            <div className="flex flex-col gap-4">
              <div className="h-8 animate-pulse rounded-lg bg-muted" />
              <div className="h-20 animate-pulse rounded-lg bg-muted" />
              <div className="h-8 animate-pulse rounded-lg bg-muted" />
            </div>
          </div>

          {/* Ödeme kartı */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-4 h-5 w-32 animate-pulse rounded-md bg-muted" />
            <div className="flex flex-col gap-4">
              <div className="h-6 w-48 animate-pulse rounded-md bg-muted" />
              <div className="h-8 animate-pulse rounded-lg bg-muted" />
              <div className="grid grid-cols-2 gap-4">
                <div className="h-8 animate-pulse rounded-lg bg-muted" />
                <div className="h-8 animate-pulse rounded-lg bg-muted" />
              </div>
            </div>
          </div>
        </div>

        {/* Sağ kolon — Özet */}
        <div className="h-80 animate-pulse rounded-xl border border-border bg-muted" />
      </div>
    </main>
  );
}
