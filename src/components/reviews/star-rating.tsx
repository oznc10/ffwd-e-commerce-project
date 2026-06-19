"use client";

// Yıldız puanlama bileşeni — salt-okunur ve interaktif mod destekler
import { useState } from "react";
import { Star } from "lucide-react";

type Size = "sm" | "md" | "lg";

const SIZE_CLASS: Record<Size, string> = {
  sm: "size-4",
  md: "size-5",
  lg: "size-7",
};

interface StarRatingProps {
  rating: number;
  size?: Size;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export default function StarRating({
  rating,
  size = "md",
  interactive = false,
  onRatingChange,
}: StarRatingProps) {
  // İnteraktif modda hover pozisyonunu takip et
  const [hovered, setHovered] = useState<number | null>(null);

  const sizeClass = SIZE_CLASS[size];
  const display = hovered ?? rating;

  return (
    <div
      className="flex items-center gap-0.5"
      onMouseLeave={() => setHovered(null)}
    >
      {Array.from({ length: 5 }, (_, i) => {
        const pos = i + 1;
        const filled = display >= pos;
        const half = !filled && display >= pos - 0.5;

        if (interactive) {
          return (
            <button
              key={i}
              type="button"
              onClick={() => onRatingChange?.(pos)}
              onMouseEnter={() => setHovered(pos)}
              className="rounded transition-transform hover:scale-110 focus:outline-none"
              aria-label={`${pos} yıldız`}
            >
              <Star
                className={`${sizeClass} transition-colors ${
                  filled
                    ? "fill-amber-400 text-amber-400"
                    : "fill-gray-200 text-gray-300"
                }`}
              />
            </button>
          );
        }

        // Salt-okunur mod: yarım yıldız desteği
        if (half) {
          return (
            <span key={i} className="relative inline-flex">
              {/* Arka plan yıldızı (boş) */}
              <Star className={`${sizeClass} fill-gray-200 text-gray-300`} />
              {/* Ön plan yıldızı sola kırpılmış (dolu kısım) */}
              <span className="absolute inset-0 w-1/2 overflow-hidden">
                <Star className={`${sizeClass} fill-amber-400 text-amber-400`} />
              </span>
            </span>
          );
        }

        return (
          <Star
            key={i}
            className={`${sizeClass} ${
              filled
                ? "fill-amber-400 text-amber-400"
                : "fill-gray-200 text-gray-300"
            }`}
          />
        );
      })}
    </div>
  );
}
