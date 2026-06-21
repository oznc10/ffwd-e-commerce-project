"use client";

// Dil değiştirme butonu — mevcut dile göre TR/EN gösterir
import { useLocale } from "next-intl";
import { Globe } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function switchLocale() {
    const nextLocale = locale === "tr" ? "en" : "tr";
    router.replace(pathname, { locale: nextLocale });
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={switchLocale}
      className="gap-1.5 text-gray-300 hover:text-white"
      aria-label="Dili değiştir"
    >
      <Globe className="size-4" />
      {locale === "tr" ? "EN" : "TR"}
    </Button>
  );
}
