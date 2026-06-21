// Global yükleme ekranı — sayfa geçişlerinde gösterilir
export default function GlobalLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <div className="size-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
      <p className="text-sm text-muted-foreground">Yükleniyor...</p>
    </div>
  );
}
