// Profil sayfası yüklenirken gösterilen skeleton
export default function ProfileLoading() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      {/* Başlık skeleton */}
      <div className="mb-8 h-8 w-28 animate-pulse rounded-md bg-muted" />

      <div className="rounded-xl border border-border bg-card p-6">
        {/* Avatar + isim alanı */}
        <div className="mb-6 flex items-center gap-4">
          <div className="size-16 animate-pulse rounded-full bg-muted" />
          <div className="flex flex-col gap-2">
            <div className="h-5 w-36 animate-pulse rounded bg-muted" />
            <div className="h-3 w-48 animate-pulse rounded bg-muted" />
          </div>
        </div>

        {/* Bilgi satırları */}
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <div className="h-3 w-20 animate-pulse rounded bg-muted" />
              <div className="h-9 animate-pulse rounded-md bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
