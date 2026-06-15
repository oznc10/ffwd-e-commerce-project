// Next.js middleware — her istekten önce çalışır, korumalı rotaları denetler
import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, type SessionData } from "@/lib/session";

// Oturum açılmadan erişilemeyen rotalar
const PROTECTED_ROUTES = ["/cart", "/checkout", "/orders", "/profile"];

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const { pathname } = req.nextUrl;

  // İstenen yol korumalı rota listesinde mi?
  const isProtected = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  // Korumalı değilse direkt devam et
  if (!isProtected) {
    return NextResponse.next();
  }

  // Edge runtime'da cookies() kullanılamaz; getIronSession'ın req/res overload'ı kullanılır
  // NextRequest → Request, NextResponse → Response olduğu için tip uyumludur
  const res = NextResponse.next();
  const session = await getIronSession<SessionData>(req, res, sessionOptions);

  // Oturum yoksa giriş sayfasına yönlendir, gelinen yolu parametre olarak ekle
  if (!session.isLoggedIn) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Oturum geçerliyse isteği sürdür
  return res;
}

// Middleware'in çalışacağı rota desenleri
// api, statik dosyalar ve favicon hariç tüm rotalar
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
