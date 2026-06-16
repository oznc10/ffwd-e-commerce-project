"use server";

// Sepet ürünlerini veritabanından çeken server action
import { getDb } from "@/lib/db";
import type { ProductWithCategory } from "@/types";

// SQLite'dan gelen ham satır tipi (is_featured integer döner)
type RawProductRow = Omit<ProductWithCategory, "is_featured"> & {
  is_featured: number;
};

const PRODUCT_SELECT = `
  SELECT
    p.id, p.name, p.description, p.price, p.stock,
    p.image_url, p.category_id, p.is_featured,
    p.created_at, p.updated_at,
    c.name AS category_name,
    c.slug AS category_slug
  FROM products p
  JOIN categories c ON p.category_id = c.id
  WHERE p.id = ?
`;

export interface CartProductItem {
  product: ProductWithCategory;
  quantity: number;
}

// Client'tan gelen cartItems listesiyle ürün detaylarını DB'den çek
export async function getCartProducts(
  cartItems: { productId: number; quantity: number }[]
): Promise<CartProductItem[]> {
  const db = getDb();
  const stmt = db.prepare(PRODUCT_SELECT);
  const result: CartProductItem[] = [];

  for (const item of cartItems) {
    const row = stmt.get(item.productId) as RawProductRow | undefined;
    if (!row) continue; // Silinmiş veya bulunamayan ürünü atla

    result.push({
      product: { ...row, is_featured: row.is_featured === 1 },
      quantity: item.quantity,
    });
  }

  return result;
}
