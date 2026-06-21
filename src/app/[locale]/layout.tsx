// Locale layout — next-intl kurulumu, tema ve sepet sağlayıcıları
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import Header from "@/components/layout/header";
import { CartProvider } from "@/context/cart-context";
import { ThemeProvider } from "@/context/theme-context";

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  // Geçersiz locale → 404
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  // Statik rendering için locale'i kaydet (next-intl zorunluluğu)
  setRequestLocale(locale);

  return (
    <NextIntlClientProvider>
      <ThemeProvider>
        <CartProvider>
          <Header />
          {children}
        </CartProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
