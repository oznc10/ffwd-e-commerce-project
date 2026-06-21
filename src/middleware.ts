// Next.js middleware — locale routing + korumalı rota denetimi
import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { sessionOptions, type SessionData } from "@/lib/session";

// next-intl middleware: locale tespiti ve /en/* yönlendirmelerini yönetir
const intlMiddleware = createIntlMiddleware(routing);

// Oturum açılmadan erişilemeyen rotalar (locale prefix'siz)
const PROTECTED_ROUTES = ["/cart", "/checkout", "/orders", "/profile"];

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const { pathname } = req.nextUrl;

  // URL'deki locale prefix'i çıkar: /en/cart → /cart, /cart → /cart
  const pathnameWithoutLocale = pathname.replace(/^\/(tr|en)(\/|$)/, "/");

  // Korumalı rota kontrolü
  const isProtected = PROTECTED_ROUTES.some(
    (route) =>
      pathnameWithoutLocale === route ||
      pathnameWithoutLocale.startsWith(route + "/")
  );

  // Korumalı değilse yalnızca locale routing uygula
  if (!isProtected) {
    return intlMiddleware(req);
  }

  // Korumalıysa oturumu kontrol et
  // Edge runtime'da req/res overload'ı kullanılır
  const res = NextResponse.next();
  const session = await getIronSession<SessionData>(req, res, sessionOptions);

  if (!session.isLoggedIn) {
    // Giriş sayfasına yönlendir, gelinen yolu parametre olarak ekle
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("from", pathnameWithoutLocale);
    return NextResponse.redirect(loginUrl);
  }

  // Oturum geçerliyse locale routing'i uygula ve devam et
  return intlMiddleware(req);
}

// Middleware'in çalışacağı rota desenleri
// api, statik dosyalar ve favicon hariç tüm rotalar
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
