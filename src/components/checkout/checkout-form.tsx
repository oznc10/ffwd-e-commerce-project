"use client";

// Checkout formu — teslimat + ödeme bilgileri ve sipariş özeti
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { createOrderAction } from "@/lib/actions/order";
import { getCartProducts, type CartProductItem } from "@/lib/actions/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatPrice } from "@/lib/utils/format";

interface FormState {
  shipping_name: string;
  shipping_address: string;
  shipping_phone: string;
  payment_method: "credit_card" | "debit_card";
  card_number: string;
  card_expiry: string;
  card_cvv: string;
}

export default function CheckoutForm() {
  const router = useRouter();
  const { items, clearCart } = useCart();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expiryError, setExpiryError] = useState<string | null>(null);
  const [cartProducts, setCartProducts] = useState<CartProductItem[]>([]);

  const [form, setForm] = useState<FormState>({
    shipping_name: "",
    shipping_address: "",
    shipping_phone: "",
    payment_method: "credit_card",
    card_number: "",
    card_expiry: "",
    card_cvv: "",
  });

  // Sepet ürünlerini server action ile çek
  useEffect(() => {
    if (items.length === 0) return;
    getCartProducts(items).then(setCartProducts);
  }, [items]);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleCardNumberChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = digits.replace(/(.{4})/g, "$1 ").trimEnd();
    setForm((prev) => ({ ...prev, card_number: formatted }));
  }

  function handleExpiryChange(e: React.ChangeEvent<HTMLInputElement>) {
    // Sadece rakam tut, maksimum 4 basamak (MMYY)
    const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
    const formatted =
      digits.length > 2 ? digits.slice(0, 2) + "/" + digits.slice(2) : digits;

    setForm((prev) => ({ ...prev, card_expiry: formatted }));

    if (formatted.length === 5) {
      const month = parseInt(formatted.slice(0, 2), 10);
      const year = parseInt(formatted.slice(3), 10);
      const now = new Date();
      const curYear = now.getFullYear() % 100;
      const curMonth = now.getMonth() + 1;

      if (
        month < 1 ||
        month > 12 ||
        year < curYear ||
        (year === curYear && month < curMonth)
      ) {
        setExpiryError("Kartın son kullanma tarihi geçmiş");
      } else {
        setExpiryError(null);
      }
    } else {
      setExpiryError(null);
    }
  }

  async function handleSubmit(e: React.BaseSyntheticEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const fd = new FormData();
    fd.append("shipping_name", form.shipping_name);
    fd.append("shipping_address", form.shipping_address);
    fd.append("shipping_phone", form.shipping_phone);
    fd.append("payment_method", form.payment_method);
    // Kart numarasındaki boşlukları temizle (Zod \d{16} bekliyor)
    fd.append("card_number", form.card_number.replace(/\s/g, ""));
    fd.append("card_expiry", form.card_expiry);
    fd.append("card_cvv", form.card_cvv);
    fd.append("cartItems", JSON.stringify(items));

    try {
      const result = await createOrderAction(fd);

      if (result.success && result.orderId) {
        clearCart();
        router.push(`/orders/${result.orderId}`);
      } else {
        setError(result.error ?? "Sipariş oluşturulamadı");
        setLoading(false);
      }
    } catch {
      // Ağ hatası veya beklenmeyen server action hatası
      setError("Sipariş oluşturulurken bir hata oluştu, lütfen tekrar deneyin.");
      setLoading(false);
    }
  }

  const subtotal = cartProducts.reduce(
    (sum, { product, quantity }) => sum + product.price * quantity,
    0
  );

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        {/* Sol kolon — Teslimat + Ödeme */}
        <div className="flex flex-col gap-6">
          {/* Hata mesajı */}
          {error && (
            <p className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </p>
          )}

          {/* Teslimat Bilgileri */}
          <Card>
            <CardHeader>
              <CardTitle>Teslimat Bilgileri</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="shipping_name">Ad Soyad</Label>
                <Input
                  id="shipping_name"
                  name="shipping_name"
                  placeholder="Adınız Soyadınız"
                  value={form.shipping_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="shipping_address">Adres</Label>
                <textarea
                  id="shipping_address"
                  name="shipping_address"
                  placeholder="Mahalle, cadde, sokak, bina no, daire..."
                  rows={3}
                  value={form.shipping_address}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 resize-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="shipping_phone">Telefon</Label>
                <Input
                  id="shipping_phone"
                  name="shipping_phone"
                  type="tel"
                  placeholder="05XX XXX XX XX"
                  maxLength={11}
                  pattern="[0-9]*"
                  value={form.shipping_phone}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      shipping_phone: e.target.value
                        .replace(/[^0-9]/g, "")
                        .slice(0, 11),
                    }))
                  }
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Ödeme Bilgileri */}
          <Card>
            <CardHeader>
              <CardTitle>Ödeme Bilgileri</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {/* Ödeme yöntemi */}
              <div className="flex flex-col gap-1.5">
                <Label>Ödeme Yöntemi</Label>
                <div className="flex gap-4">
                  {(
                    [
                      { value: "credit_card", label: "Kredi Kartı" },
                      { value: "debit_card", label: "Banka Kartı" },
                    ] as const
                  ).map(({ value, label }) => (
                    <label
                      key={value}
                      className="flex cursor-pointer items-center gap-2 text-sm"
                    >
                      <input
                        type="radio"
                        name="payment_method"
                        value={value}
                        checked={form.payment_method === value}
                        onChange={handleChange}
                        className="accent-primary"
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Kart numarası */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="card_number">Kart Numarası</Label>
                <Input
                  id="card_number"
                  name="card_number"
                  type="text"
                  inputMode="numeric"
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  value={form.card_number}
                  onChange={handleCardNumberChange}
                  required
                />
              </div>

              {/* Son kullanma + CVV */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="card_expiry">Son Kullanma</Label>
                  <Input
                    id="card_expiry"
                    name="card_expiry"
                    type="text"
                    placeholder="MM/YY"
                    maxLength={5}
                    value={form.card_expiry}
                    onChange={handleExpiryChange}
                    required
                  />
                  {expiryError && (
                    <p className="text-xs text-destructive">{expiryError}</p>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="card_cvv">CVV</Label>
                  <Input
                    id="card_cvv"
                    name="card_cvv"
                    type="password"
                    inputMode="numeric"
                    placeholder="123"
                    maxLength={3}
                    value={form.card_cvv}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        card_cvv: e.target.value.replace(/\D/g, "").slice(0, 3),
                      }))
                    }
                    required
                  />
                </div>
              </div>

              {/* Güvenlik notu */}
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Shield className="size-3.5 shrink-0" />
                Kart bilgileriniz güvende — ödeme bilgileri saklanmaz.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sağ kolon — Sipariş Özeti */}
        <div className="lg:sticky lg:top-20">
          <Card>
            <CardHeader>
              <CardTitle>Sipariş Özeti</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {/* Ürün listesi */}
              <div className="flex flex-col gap-2 border-b border-border pb-4">
                {cartProducts.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="flex items-start justify-between gap-2 text-sm"
                  >
                    <span className="line-clamp-2 text-muted-foreground">
                      {product.name}{" "}
                      <span className="font-medium text-foreground">
                        ×{quantity}
                      </span>
                    </span>
                    <span className="shrink-0 font-medium">
                      {formatPrice(product.price * quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Fiyat detayları */}
              <div className="flex flex-col gap-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ara Toplam</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Kargo</span>
                  <span className="text-green-600">Ücretsiz</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2 text-base font-bold">
                  <span>Genel Toplam</span>
                  <span className="text-primary">{formatPrice(subtotal)}</span>
                </div>
              </div>

              {/* Siparişi tamamla */}
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={loading || items.length === 0}
              >
                {loading ? "İşleniyor..." : "Siparişi Tamamla"}
              </Button>

              <Link
                href="/cart"
                className="block text-center text-sm text-muted-foreground underline-offset-4 hover:underline"
              >
                Sepete Dön
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
