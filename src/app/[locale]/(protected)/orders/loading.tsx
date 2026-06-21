// Sipariş listesi yüklenirken gösterilen skeleton
export default function OrdersLoading() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-8 h-8 w-40 animate-pulse rounded-md bg-muted" />
      <div className="flex flex-col gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-xl border border-border bg-muted"
          />
        ))}
      </div>
    </main>
  );
}
