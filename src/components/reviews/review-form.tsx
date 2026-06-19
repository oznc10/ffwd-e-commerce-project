"use client";

// Yorum formu — yıldız seçimi + metin alanı
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createReviewAction } from "@/lib/actions/review";
import { Button } from "@/components/ui/button";
import StarRating from "@/components/reviews/star-rating";

interface ReviewFormProps {
  productId: number;
}

const MAX_COMMENT = 500;

export default function ReviewForm({ productId }: ReviewFormProps) {
  const router = useRouter();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.BaseSyntheticEvent) {
    e.preventDefault();
    setError(null);

    if (rating === 0) {
      setError("Lütfen bir puan seçin.");
      return;
    }

    setLoading(true);

    const fd = new FormData();
    fd.set("rating", String(rating));
    fd.set("comment", comment);

    const result = await createReviewAction(productId, fd);

    if (result.success) {
      setRating(0);
      setComment("");
      setSuccess(true);
      router.refresh();
    } else {
      setError(result.error ?? "Yorum gönderilemedi.");
    }

    setLoading(false);
  }

  if (success) {
    return (
      <p className="rounded-md bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-950/30 dark:text-green-400">
        Yorumunuz başarıyla gönderildi. Teşekkürler!
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Hata mesajı */}
      {error && (
        <p className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      {/* Yıldız seçimi */}
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium">Puanınız</span>
        <StarRating
          rating={rating}
          size="lg"
          interactive
          onRatingChange={setRating}
        />
      </div>

      {/* Yorum metni */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="comment" className="text-sm font-medium">
          Yorumunuz
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value.slice(0, MAX_COMMENT))}
          placeholder="Ürün hakkında düşüncelerinizi paylaşın..."
          rows={4}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 resize-none"
          required
        />
        {/* Karakter sayacı */}
        <p className="text-right text-xs text-muted-foreground">
          {comment.length} / {MAX_COMMENT}
        </p>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Gönderiliyor..." : "Yorumu Gönder"}
      </Button>
    </form>
  );
}
