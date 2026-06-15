// Session yönetimi - iron-session ile şifreli cookie tabanlı oturum
import { getIronSession, type IronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";

// Session içinde saklanacak veri yapısı
export interface SessionData {
  user?: {
    id: number;
    name: string;
    email: string;
    role: "user" | "admin";
  };
  isLoggedIn: boolean;
}

// Cookie ve şifreleme ayarları
export const sessionOptions: SessionOptions = {
  cookieName: "ecommerce_session",
  // SESSION_SECRET en az 32 karakter olmalıdır; production'da .env ile sağlanmalıdır
  password:
    process.env.SESSION_SECRET ??
    "bu-cok-gizli-bir-sifre-32-karakter-uzun",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    // 7 günlük oturum süresi (saniye cinsinden)
    maxAge: 60 * 60 * 24 * 7,
  },
};

// Server Component, Route Handler ve Server Function'larda kullanılacak session helper'ı
// Next.js 16'da cookies() async olduğu için bu fonksiyon da async olmak zorundadır
export async function getSession(): Promise<IronSession<SessionData>> {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}
