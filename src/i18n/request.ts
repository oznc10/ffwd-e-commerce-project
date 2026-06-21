// Her server-side istek için dil yapılandırması — next-intl bu dosyayı otomatik okur
import { getRequestConfig } from "next-intl/server";
import { routing, type Locale } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  // requestLocale, URL segmentindeki [locale] değerini Promise olarak verir
  let locale = await requestLocale;

  // Geçersiz veya eksik locale durumunda varsayılana düş
  if (!locale || !routing.locales.includes(locale as Locale)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (
      await import(`../../messages/${locale}.json`)
    ).default,
  };
});
