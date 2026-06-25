"use client";

// Root seviyesi hata sınırı — [locale] layout'u dışında kalan hatalar için
// useTranslations kullanılmaz çünkü NextIntlClientProvider bu noktada henüz aktif değil
import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function RootErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <AlertTriangle className="size-14 text-destructive opacity-80" />

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Bir Hata Oluştu</h1>
        {error.message && (
          <p className="max-w-sm text-sm text-muted-foreground">
            {error.message}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button onClick={reset}>Tekrar Dene</Button>
        <Button variant="outline" asChild>
          <Link href="/">Ana Sayfaya Dön</Link>
        </Button>
      </div>
    </main>
  );
}
