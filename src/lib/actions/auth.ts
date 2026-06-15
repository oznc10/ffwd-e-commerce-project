"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { getSession } from "@/lib/session";
import type { User } from "@/types";

// ── Zod şemaları ─────────────────────────────────────────────────────────────

const RegisterSchema = z.object({
  name: z.string().min(2, "Ad en az 2 karakter olmalıdır"),
  email: z.string().email("Geçerli bir email adresi girin"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
});

const LoginSchema = z.object({
  email: z.string().email("Geçerli bir email adresi girin"),
  password: z.string().min(1, "Şifre boş olamaz"),
});

// Ortak dönüş tipi
type ActionResult = Promise<{ success: boolean; error?: string }>;

// ── Kayıt ────────────────────────────────────────────────────────────────────

export async function registerAction(formData: FormData): ActionResult {
  // Form verilerini nesneye dönüştür ve doğrula
  const parsed = RegisterSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  const { name, email, password } = parsed.data;

  try {
    const db = getDb();

    // Email daha önce kullanılmış mı kontrol et
    const existing = db
      .prepare("SELECT id FROM users WHERE email = ?")
      .get(email);

    if (existing) {
      return { success: false, error: "Bu email zaten kayıtlı" };
    }

    // Şifreyi hashle
    const password_hash = await bcrypt.hash(password, 10);

    // Kullanıcıyı veritabanına kaydet
    const result = db
      .prepare(
        "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)"
      )
      .run(name, email, password_hash);

    const userId = Number(result.lastInsertRowid);

    // Session oluştur ve kaydet
    const session = await getSession();
    session.isLoggedIn = true;
    session.user = { id: userId, name, email, role: "user" };
    await session.save();

    return { success: true };
  } catch (error) {
    console.error("[registerAction] Hata:", error);
    return { success: false, error: "Kayıt sırasında bir hata oluştu" };
  }
}

// ── Giriş ─────────────────────────────────────────────────────────────────

export async function loginAction(formData: FormData): ActionResult {
  // Form verilerini doğrula
  const parsed = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  const { email, password } = parsed.data;

  try {
    const db = getDb();

    // Kullanıcıyı email ile bul
    const user = db
      .prepare("SELECT * FROM users WHERE email = ?")
      .get(email) as User | undefined;

    // Güvenlik: kullanıcı bulunamasa da şifre yanlışsa aynı hatayı dön (timing attack önlemi)
    if (!user) {
      return { success: false, error: "Email veya şifre hatalı" };
    }

    // Şifreyi doğrula
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return { success: false, error: "Email veya şifre hatalı" };
    }

    // Session oluştur ve kaydet
    const session = await getSession();
    session.isLoggedIn = true;
    session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    await session.save();

    return { success: true };
  } catch (error) {
    console.error("[loginAction] Hata:", error);
    return { success: false, error: "Giriş sırasında bir hata oluştu" };
  }
}

// ── Çıkış ─────────────────────────────────────────────────────────────────

export async function logoutAction(): Promise<void> {
  try {
    const session = await getSession();
    // Session verisini temizle ve cookie'yi sil
    session.destroy();
  } catch (error) {
    console.error("[logoutAction] Hata:", error);
  }

  // redirect() Next.js'te özel bir exception fırlatır;
  // try/catch dışında çağrılmazsa yutulur
  redirect("/login");
}
