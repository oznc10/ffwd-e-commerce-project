// Ürün ve kategori sorgularını kapsayan veri erişim katmanı
import { getDb } from "@/lib/db";
import type { Category, ProductWithCategory } from "@/types";

// SQLite is_featured alanı 0/1 integer döner; TypeScript tipi boolean bekler
// Bu yardımcı tip ham satır yapısını temsil eder
type RawProductRow = Omit<ProductWithCategory, "is_featured"> & {
  is_featured: number;
};

// Ham satırı TypeScript tipine dönüştür (is_featured: 0/1 → boolean)
function mapProduct(row: RawProductRow): ProductWithCategory {
  return { ...row, is_featured: row.is_featured === 1 };
}

// Ürün listesi sorgusunun ortak JOIN + SELECT ifadesi
const PRODUCT_SELECT = `
  SELECT
    p.id, p.name, p.description, p.price, p.stock,
    p.image_url, p.category_id, p.is_featured,
    p.created_at, p.updated_at,
    c.name  AS category_name,
    c.slug  AS category_slug
  FROM products p
  JOIN categories c ON p.category_id = c.id
`;

// ── 1. Tüm kategorileri getir ──────────────────────────────────────────────

export function getAllCategories(): Category[] {
  try {
    return getDb()
      .prepare("SELECT * FROM categories ORDER BY created_at ASC")
      .all() as Category[];
  } catch (error) {
    console.error("[getAllCategories] Hata:", error);
    throw error;
  }
}

// ── 2. Öne çıkan ürünleri getir ───────────────────────────────────────────

export function getFeaturedProducts(): ProductWithCategory[] {
  try {
    const rows = getDb()
      .prepare(`${PRODUCT_SELECT} WHERE p.is_featured = 1 LIMIT 8`)
      .all() as RawProductRow[];

    return rows.map(mapProduct);
  } catch (error) {
    console.error("[getFeaturedProducts] Hata:", error);
    throw error;
  }
}

// ── 3. Filtreli ürün listesi ──────────────────────────────────────────────

export interface GetProductsOptions {
  search?: string;
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "price_asc" | "price_desc" | "newest" | "oldest";
  page?: number;
  limit?: number;
}

export interface GetProductsResult {
  products: ProductWithCategory[];
  total: number;
  totalPages: number;
}

// sortBy değerini güvenli SQL ORDER BY ifadesine çevir
const SORT_MAP: Record<NonNullable<GetProductsOptions["sortBy"]>, string> = {
  price_asc: "p.price ASC",
  price_desc: "p.price DESC",
  newest: "p.created_at DESC",
  oldest: "p.created_at ASC",
};

export function getProducts(options: GetProductsOptions = {}): GetProductsResult {
  const {
    search,
    categorySlug,
    minPrice,
    maxPrice,
    sortBy = "newest",
    page = 1,
    limit = 12,
  } = options;

  try {
    // WHERE koşulları ve parametreler dinamik olarak oluşturulur
    const conditions: string[] = [];
    const params: (string | number)[] = [];

    if (search) {
      conditions.push("(p.name LIKE ? OR p.description LIKE ?)");
      const term = `%${search}%`;
      params.push(term, term);
    }

    if (categorySlug) {
      conditions.push("c.slug = ?");
      params.push(categorySlug);
    }

    if (minPrice !== undefined) {
      conditions.push("p.price >= ?");
      params.push(minPrice);
    }

    if (maxPrice !== undefined) {
      conditions.push("p.price <= ?");
      params.push(maxPrice);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const orderClause = `ORDER BY ${SORT_MAP[sortBy]}`;

    const db = getDb();

    // Toplam kayıt sayısı için ayrı COUNT sorgusu
    const countSql = `
      SELECT COUNT(*) AS total
      FROM products p
      JOIN categories c ON p.category_id = c.id
      ${whereClause}
    `;
    const { total } = db.prepare(countSql).get(...params) as { total: number };

    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;

    // Sayfalı ürün sorgusu
    const productSql = `
      ${PRODUCT_SELECT}
      ${whereClause}
      ${orderClause}
      LIMIT ? OFFSET ?
    `;
    const rows = db
      .prepare(productSql)
      .all(...params, limit, offset) as RawProductRow[];

    return { products: rows.map(mapProduct), total, totalPages };
  } catch (error) {
    console.error("[getProducts] Hata:", error);
    throw error;
  }
}

// ── 4. Tek ürün getir ─────────────────────────────────────────────────────

export function getProductById(id: number): ProductWithCategory | null {
  try {
    const row = getDb()
      .prepare(`${PRODUCT_SELECT} WHERE p.id = ?`)
      .get(id) as RawProductRow | undefined;

    return row ? mapProduct(row) : null;
  } catch (error) {
    console.error("[getProductById] Hata:", error);
    throw error;
  }
}

// ── 5. Kategoriye göre ürünler ────────────────────────────────────────────

export function getProductsByCategory(
  categorySlug: string
): ProductWithCategory[] {
  try {
    const rows = getDb()
      .prepare(`${PRODUCT_SELECT} WHERE c.slug = ? ORDER BY p.created_at DESC`)
      .all(categorySlug) as RawProductRow[];

    return rows.map(mapProduct);
  } catch (error) {
    console.error("[getProductsByCategory] Hata:", error);
    throw error;
  }
}
