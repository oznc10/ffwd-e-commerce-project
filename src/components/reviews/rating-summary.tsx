// Puan özeti — ortalama + toplam değerlendirme sayısı
import StarRating from "@/components/reviews/star-rating";

interface RatingSummaryProps {
  average: number;
  count: number;
}

export default function RatingSummary({ average, count }: RatingSummaryProps) {
  return (
    <div className="flex items-center gap-3">
      {/* Büyük ortalama sayısı */}
      <span className="text-4xl font-bold tabular-nums">
        {count === 0 ? "—" : average.toFixed(1)}
      </span>

      <div className="flex flex-col gap-1">
        <StarRating rating={average} size="md" />
        <span className="text-sm text-muted-foreground">
          {count === 0
            ? "Henüz değerlendirme yok"
            : `${count} değerlendirme`}
        </span>
      </div>
    </div>
  );
}
