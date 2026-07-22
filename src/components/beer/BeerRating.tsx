"use client";

import { useState } from "react";

type BeerRatingProps = {
  value: number;
  onChange?: (rating: number) => void;
  max?: number;
  readOnly?: boolean;
};

function BeerMug({ filled, size = 28 }: { filled: boolean; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "#F59E0B" : "none"}
      stroke={filled ? "#F59E0B" : "#9CA3AF"}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 8h10v9a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V8z" />
      <path d="M16 10h2a2 2 0 0 1 0 4h-2" />
      <path d="M8 5h1" />
      <path d="M12 5h1" />
      <path d="M9 3h1" />
      <path d="M13 3h1" />
    </svg>
  );
}

export function BeerRating({
  value,
  onChange,
  max = 5,
  readOnly = false,
}: BeerRatingProps) {
  const [hovered, setHovered] = useState(0);

  const displayValue = hovered || value;

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }, (_, index) => {
        const ratingValue = index + 1;
        const filled = ratingValue <= displayValue;

        return (
          <button
            key={ratingValue}
            type="button"
            disabled={readOnly}
            onClick={() => onChange?.(ratingValue)}
            onMouseEnter={() => !readOnly && setHovered(ratingValue)}
            onMouseLeave={() => !readOnly && setHovered(0)}
            className={readOnly ? "cursor-default" : "cursor-pointer"}
            aria-label={`Rate ${ratingValue} out of ${max}`}
          >
            <BeerMug filled={filled} />
          </button>
        );
      })}
    </div>
  );
}
