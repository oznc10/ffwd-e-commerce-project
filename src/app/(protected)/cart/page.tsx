// Sepet sayfası — server component, oturum kontrolü yapar
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import CartPageClient from "@/components/cart/cart-page-client";

export default async function CartPage() {
  const session = await getSession();

  if (!session.isLoggedIn || !session.user) {
    redirect("/login");
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 text-2xl font-bold tracking-tight">Sepetim</h1>
      {/* localStorage'a erişim için client component gerekli */}
      <CartPageClient />
    </main>
  );
}
