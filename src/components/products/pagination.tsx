"use client";

// Sayfalama bileşeni — mevcut URL parametrelerini koruyarak sayfa değiştirir
import { useRouter, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  // Mevcut filtre parametrelerini sunucudan alıyoruz; useSearchParams hook'una gerek yok
  searchParams: Record<string, string | string[] | undefined>;
}

export default function Pagination({
  currentPage,
  totalPages,
  searchParams,
}: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Tek sayfa veya sayfa yoksa hiç render etme
  if (totalPages <= 1) return null;

  function goToPage(page: number) {
    // Mevcut tüm parametreleri koru, sadece page'i değiştir
    const params = new URLSearchParams();

    for (const [key, val] of Object.entries(searchParams)) {
      if (key === "page" || val === undefined) continue;
      params.set(key, String(val));
    }

    if (page > 1) params.set("page", String(page));

    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  return (
    <div className="flex items-center justify-center gap-3 pt-8">
      <Button
        variant="outline"
        size="sm"
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Önceki sayfa"
      >
        <ChevronLeft className="size-4" />
        Önceki
      </Button>

      <span className="text-sm text-muted-foreground">
        Sayfa{" "}
        <span className="font-medium text-foreground">{currentPage}</span>
        {" / "}
        <span className="font-medium text-foreground">{totalPages}</span>
      </span>

      <Button
        variant="outline"
        size="sm"
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="Sonraki sayfa"
      >
        Sonraki
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
}
