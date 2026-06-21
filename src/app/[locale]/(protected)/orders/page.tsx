// Sipariş geçmişi sayfası — server component
import Link from "next/link";
import { redirect } from "next/navigation";
import { PackageSearch } from "lucide-react";
import { getSession } from "@/lib/session";
import { getUserOrders } from "@/lib/actions/order";
import { Button } from "@/components/ui/button";
import type { Order } from "@/types";

function formatPrice(price: number): string {
  return (
    new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 }).format(
      price
    ) + " ₺"
  );
}

// Durum badge'i — her statüs için farklı renk
const STATUS_STYLES: Record<Order["status"], { label: string; className: string }> = {
  pending:    { label: "Beklemede",      className: "bg-yellow-100 text-yellow-800" },
  processing: { label: "İşlemde",        className: "bg-blue-100 text-blue-800" },
  shipped:    { label: "Kargoda",        className: "bg-purple-100 text-purple-800" },
  delivered:  { label: "Teslim Edildi",  className: "bg-green-100 text-green-800" },
  cancelled:  { label: "İptal Edildi",   className: "bg-red-100 text-red-800" },
};

export default async function OrdersPage() {
  const session = await getSession();
  if (!session.isLoggedIn || !session.user) redirect("/login");

  const orders = await getUserOrders();

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 text-2xl font-bold tracking-tight">Siparişlerim</h1>

      {orders.length === 0 ? (
        // Boş durum
        <div className="flex flex-col items-center gap-4 py-24 text-center text-muted-foreground">
          <PackageSearch className="size-14 opacity-40" />
          <div>
            <p className="text-base font-medium text-foreground">
              Henüz siparişiniz yok
            </p>
            <p className="mt-1 text-sm">
              İlk siparişinizi vermek için alışverişe başlayın.
            </p>
          </div>
          <Button asChild>
            <Link href="/products">Alışverişe Başla</Link>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => {
            const status = STATUS_STYLES[order.status];
            return (
              <div
                key={order.id}
                className="rounded-xl border border-border bg-card p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
              >
                {/* Sol: sipariş bilgileri */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold">{order.order_number}</span>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString("tr-TR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.items.length} ürün
                  </p>
                </div>

                {/* Sağ: fiyat + detay butonu */}
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-primary">
                    {formatPrice(order.total_amount)}
                  </span>
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/orders/${order.id}`}>Detayı Gör</Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
