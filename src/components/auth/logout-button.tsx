"use client";

// Çıkış butonu — önce sepeti temizler, sonra oturumu kapatır
import { useTranslations } from "next-intl";
import { logoutAction } from "@/lib/actions/auth";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const t = useTranslations("nav");
  const { clearCart } = useCart();

  async function handleLogout() {
    // localStorage sepetini temizle, ardından server-side oturumu kapat
    clearCart();
    await logoutAction();
  }

  return (
    <Button variant="destructive" size="sm" onClick={handleLogout}>
      {t("logout")}
    </Button>
  );
}
