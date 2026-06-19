"use server";

// Ürün yorum action'ları ve sorgu fonksiyonları
import { z } from "zod";
import { getDb } from "@/lib/db";
import { getSession } from "@/lib/session";
import type { ReviewWithUser } from "@/types";

// ── Zod şeması ────────────────────────────────────────────────────────────

const ReviewSchema = z.object({
  rating: z.number().min(1, "Puan en az 1 olmalıdır").max(5, "Puan en fazla 5 olabilir"),
  comment: z
    .string()
    .min(10, "Yorum en az 10 karakter olmalıdır")
    .max(500, "Yorum en fazla 500 karakter olabilir"),
});

// ── Yorum oluştur ─────────────────────────────────────────────────────────

export async function createReviewAction(
  productId: number,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  // Oturum kontrolü
  const session = await getSession();
  if (!session.isLoggedIn || !session.user) {
    return { success: false, error: "Yorum yapmak için giriş yapmalısınız." };
  }

  // Validasyon
  const parsed = ReviewSchema.safeParse({
    rating: Number(formData.get("rating")),
    comment: formData.get("comment"),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  const { rating, comment } = parsed.data;
  const userId = session.user.id;
  const db = getDb();

  try {
    // Kullanıcının bu ürüne önceden yorum yapıp yapmadığını kontrol et
    const existing = db
      .prepare(
        "SELECT id FROM reviews WHERE product_id = ? AND user_id = ?"
      )
      .get(productId, userId);

    if (existing) {
      return { success: false, error: "Bu ürüne zaten yorum yaptınız." };
    }

    // Yorumu kaydet
    db.prepare(
      "INSERT INTO reviews (product_id, user_id, rating, comment) VALUES (?, ?, ?, ?)"
    ).run(productId, userId, rating, comment);

    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Yorum kaydedilemedi.";
    console.error("[createReviewAction] Hata:", error);
    return { success: false, error: message };
  }
}

// ── Ürünün yorumlarını getir ──────────────────────────────────────────────

export async function getProductReviews(
  productId: number
): Promise<ReviewWithUser[]> {
  const db = getDb();

  return db
    .prepare(
      `SELECT
         r.id, r.product_id, r.user_id, r.rating, r.comment, r.created_at,
         u.name AS user_name
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.product_id = ?
       ORDER BY r.created_at DESC`
    )
    .all(productId) as ReviewWithUser[];
}

// ── Ürünün puan istatistiklerini getir ───────────────────────────────────

export async function getProductRatingStats(
  productId: number
): Promise<{ average: number; count: number }> {
  const db = getDb();

  const row = db
    .prepare(
      `SELECT
         COALESCE(AVG(rating), 0) AS average,
         COUNT(*)                 AS count
       FROM reviews
       WHERE product_id = ?`
    )
    .get(productId) as { average: number; count: number };

  return { average: row.average, count: row.count };
}

// ── Kullanıcının bu ürüne yorum yapıp yapmadığını kontrol et ─────────────

export async function hasUserReviewed(productId: number): Promise<boolean> {
  const session = await getSession();
  if (!session.isLoggedIn || !session.user) return false;

  const db = getDb();

  const row = db
    .prepare(
      "SELECT id FROM reviews WHERE product_id = ? AND user_id = ?"
    )
    .get(productId, session.user.id);

  return row !== undefined;
}
