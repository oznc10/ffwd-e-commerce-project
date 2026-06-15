import { NextResponse } from "next/server";
import { initializeDatabase, getDb } from "@/lib/db";
import type { Category } from "@/types";

export async function GET(): Promise<NextResponse> {
  try {
    // Tabloları oluştur ve seed datayı yükle (idempotent)
    initializeDatabase();

    const db = getDb();

    const categories = db
      .prepare("SELECT * FROM categories ORDER BY id")
      .all() as Category[];

    const productCount = (
      db.prepare("SELECT COUNT(*) as count FROM products").get() as {
        count: number;
      }
    ).count;

    return NextResponse.json({
      categories,
      productCount,
      message: "Veritabanı çalışıyor",
    });
  } catch (error) {
    console.error("[test-db] Hata:", error);
    return NextResponse.json(
      { error: "Veritabanı başlatılamadı" },
      { status: 500 }
    );
  }
}
