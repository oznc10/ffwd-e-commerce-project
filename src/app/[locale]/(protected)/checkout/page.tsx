// Ödeme sayfası — server component, oturum kontrolü yapar
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import CheckoutForm from "@/components/checkout/checkout-form";

export default async function CheckoutPage() {
  const session = await getSession();

  if (!session.isLoggedIn || !session.user) {
    redirect("/login");
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 text-2xl font-bold tracking-tight">Ödeme</h1>
      <CheckoutForm />
    </main>
  );
}
