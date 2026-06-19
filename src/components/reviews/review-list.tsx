// Yorum listesi — salt-okunur server component, veriyi prop olarak alır
import type { ReviewWithUser } from "@/types";
import StarRating from "@/components/reviews/star-rating";

interface ReviewListProps {
  reviews: ReviewWithUser[];
}

export default function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        Henüz yorum yapılmamış. İlk yorumu sen yap!
      </p>
    );
  }

  return (
    <div className="flex flex-col divide-y divide-border">
      {reviews.map((review) => (
        <div key={review.id} className="flex gap-3 py-4">
          {/* Avatar: kullanıcı adının ilk harfi */}
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
            {review.user_name.charAt(0).toUpperCase()}
          </div>

          <div className="flex flex-col gap-1">
            {/* Üst satır: isim + yıldız + tarih */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold">{review.user_name}</span>
              <StarRating rating={review.rating} size="sm" />
              <span className="text-xs text-muted-foreground">
                {new Date(review.created_at).toLocaleDateString("tr-TR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>

            {/* Yorum metni */}
            <p className="text-sm text-foreground">{review.comment}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
