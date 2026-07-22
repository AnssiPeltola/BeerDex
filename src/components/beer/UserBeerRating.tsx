"use client";

import { useState, useTransition } from "react";

import { BeerRating } from "./BeerRating";
import { setBeerRating } from "@/app/(protected)/beers/[beerId]/actions";

type UserBeerRatingProps = {
  beerId: number;
  initialRating: number | null;
};

export function UserBeerRating({ beerId, initialRating }: UserBeerRatingProps) {
  const [rating, setRating] = useState(initialRating ?? 0);
  const [isPending, startTransition] = useTransition();

  async function handleRatingChange(newRating: number) {
    // Update UI immediately
    setRating(newRating);

    startTransition(async () => {
      await setBeerRating(beerId, newRating);
    });
  }

  return (
    <div className="space-y-2">
      <BeerRating value={rating} onChange={handleRatingChange} />

      <p className="text-sm text-gray-600">
        {rating === 0
          ? "Tap a beer mug to rate this beer"
          : `You rated this beer ${rating}/5`}
      </p>

      {isPending && <p className="text-sm text-gray-500">Saving rating...</p>}
    </div>
  );
}
