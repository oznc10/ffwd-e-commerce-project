// Merkezi format yardımcıları — fiyat, tarih vb. formatlama işlemleri

// Fiyatı Türk Lirası formatına çevir: 54999 → "54.999 ₺"
export function formatPrice(price: number): string {
  return (
    new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 }).format(
      price
    ) + " ₺"
  );
}
