// Sipariş detay sayfası — server component
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getOrderById } from "@/lib/actions/order";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Order } from "@/types";
import { formatPrice } from "@/lib/utils/format";

const STATUS_STYLES: Record<Order["status"], { label: string; className: string }> = {
  pending:    { label: "Beklemede",      className: "bg-yellow-100 text-yellow-800" },
  processing: { label: "İşlemde",        className: "bg-blue-100 text-blue-800" },
  shipped:    { label: "Kargoda",        className: "bg-purple-100 text-purple-800" },
  delivered:  { label: "Teslim Edildi",  className: "bg-green-100 text-green-800" },
  cancelled:  { label: "İptal Edildi",   className: "bg-red-100 text-red-800" },
};

const PAYMENT_LABELS: Record<string, string> = {
  credit_card: "Kredi Kartı",
  debit_card: "Banka Kartı",
};

// Next.js 16'da params bir Promise — await et
export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderById(Number(id));

  if (!order) notFound();

  const status = STATUS_STYLES[order.status];

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      {/* Geri linki */}
      <Link
        href="/orders"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        Siparişlerime Dön
      </Link>

      {/* Sipariş başlığı */}
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold tracking-tight">
          {order.order_number}
        </h1>
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${status.className}`}
        >
          {status.label}
        </span>
        <span className="text-sm text-muted-foreground">
          {new Date(order.created_at).toLocaleDateString("tr-TR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </span>
      </div>

      {/* İki kolon */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        {/* Sol: Sipariş kalemleri */}
        <Card>
          <CardHeader>
            <CardTitle>Sipariş Kalemleri</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Başlık satırı */}
            <div className="mb-2 grid grid-cols-[1fr_auto_auto_auto] gap-4 border-b border-border pb-2 text-xs font-medium uppercase text-muted-foreground">
              <span>Ürün</span>
              <span className="text-right">Birim Fiyat</span>
              <span className="text-right">Adet</span>
              <span className="text-right">Toplam</span>
            </div>

            {/* Ürün satırları */}
            <div className="divide-y divide-border">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-4 py-3 text-sm"
                >
                  {/* Ürün görseli */}
                  <div className="relative size-[50px] shrink-0 overflow-hidden rounded-md bg-muted">
                    {item.product_image ? (
                      <Image
                        src={item.product_image}
                        alt={item.product_name ?? "Ürün"}
                        fill
                        className="object-cover"
                        sizes="50px"
                      />
                    ) : (
                      <div className="size-full bg-muted" />
                    )}
                  </div>

                  {/* Ürün adı */}
                  <span className="font-medium line-clamp-2">
                    {item.product_name ?? `Ürün #${item.product_id}`}
                  </span>

                  <span className="text-right text-muted-foreground">
                    {formatPrice(item.unit_price)}
                  </span>
                  <span className="text-right text-muted-foreground">
                    ×{item.quantity}
                  </span>
                  <span className="text-right font-semibold">
                    {formatPrice(item.unit_price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Alt toplam */}
            <div className="mt-4 flex justify-end border-t border-border pt-4">
              <div className="flex items-center gap-4 text-base font-bold">
                <span>Toplam</span>
                <span className="text-primary">
                  {formatPrice(order.total_amount)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sağ: Teslimat + Ödeme bilgileri */}
        <div className="flex flex-col gap-4">
          {/* Teslimat Bilgileri */}
          <Card>
            <CardHeader>
              <CardTitle>Teslimat Bilgileri</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 text-sm">
              <div>
                <span className="text-xs uppercase text-muted-foreground">
                  Ad Soyad
                </span>
                <p className="font-medium">{order.shipping_name}</p>
              </div>
              <div>
                <span className="text-xs uppercase text-muted-foreground">
                  Adres
                </span>
                <p className="font-medium">{order.shipping_address}</p>
              </div>
              <div>
                <span className="text-xs uppercase text-muted-foreground">
                  Telefon
                </span>
                <p className="font-medium">{order.shipping_phone}</p>
              </div>
            </CardContent>
          </Card>

          {/* Ödeme Özeti */}
          <Card>
            <CardHeader>
              <CardTitle>Ödeme Özeti</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm">
              <div>
                <span className="text-xs uppercase text-muted-foreground">
                  Ödeme Yöntemi
                </span>
                <p className="font-medium">
                  {PAYMENT_LABELS[order.payment_method] ?? order.payment_method}
                </p>
              </div>
              <div className="border-t border-border pt-3">
                <span className="text-xs uppercase text-muted-foreground">
                  Toplam Tutar
                </span>
                <p className="mt-0.5 text-2xl font-bold text-primary">
                  {formatPrice(order.total_amount)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
