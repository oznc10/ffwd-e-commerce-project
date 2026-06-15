// Profil sayfası — sadece oturum açmış kullanıcılar erişebilir
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { LogoutButton } from "@/components/auth/logout-button";

export default async function ProfilePage() {
  const session = await getSession();

  // Oturum yoksa giriş sayfasına yönlendir
  if (!session.isLoggedIn || !session.user) {
    redirect("/login");
  }

  const { name, email, role } = session.user;

  return (
    <div className="min-h-screen bg-muted/40 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-xl bg-card ring-1 ring-foreground/10 p-6 flex flex-col gap-6">
        {/* Başlık */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Profilim</h1>
          <LogoutButton />
        </div>

        {/* Kullanıcı bilgileri */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">
              Ad Soyad
            </span>
            <span className="text-sm font-medium">{name}</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">
              Email
            </span>
            <span className="text-sm font-medium">{email}</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">
              Rol
            </span>
            <span className="inline-flex w-fit items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              {role === "admin" ? "Yönetici" : "Kullanıcı"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
