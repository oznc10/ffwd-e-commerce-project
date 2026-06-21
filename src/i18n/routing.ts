// next-intl rota yapılandırması — desteklenen diller ve varsayılan dil
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["tr", "en"],
  defaultLocale: "tr",
  // Varsayılan dil (tr) için URL prefix eklenmez: /products, /cart vb. korunur.
  // İngilizce için prefix eklenir: /en/products, /en/cart
  localePrefix: "as-needed",
  localeDetection: false,
});

// Tip yardımcıları
export type Locale = (typeof routing.locales)[number];
