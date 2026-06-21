"use client";

// Çıkış butonu — server action tetikler, ayrı client component olarak yazıldı
// çünkü profile sayfası server component ve event handler barındıramaz
import { useTranslations } from "next-intl";
import { logoutAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const t = useTranslations("nav");

  return (
    <form action={logoutAction}>
      <Button type="submit" variant="destructive" size="sm">
        {t("logout")}
      </Button>
    </form>
  );
}
