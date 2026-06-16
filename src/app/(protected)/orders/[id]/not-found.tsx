// Sipariş bulunamadığında veya yetkisiz erişimde gösterilen sayfa
import Link from "next/link";
import { PackageX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OrderNotFound() {
  return (
    <main className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-6 px-4 py-32 text-center sm:px-6">
      <PackageX className="size-16 text-muted-foreground opacity-50" />
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Sipariş Bulunamadı</h1>
        <p className="text-muted-foreground">
          Bu sipariş mevcut değil ya da görüntüleme yetkiniz yok.
        </p>
      </div>
      <Button asChild>
        <Link href="/orders">Siparişlerime Dön</Link>
      </Button>
    </main>
  );
}
