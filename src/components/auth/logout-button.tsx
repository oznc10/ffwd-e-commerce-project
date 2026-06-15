"use client";

// Çıkış butonu — server action tetikler, ayrı client component olarak yazıldı
// çünkü profile sayfası server component ve event handler barındıramaz
import { logoutAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <Button type="submit" variant="destructive" size="sm">
        Çıkış Yap
      </Button>
    </form>
  );
}
