"use client";

import { BeerRating } from "@/components/beer/BeerRating";
import { useBeerWizardStore } from "@/stores/beer-wizard-store";

export default function ReviewStep() {
  const { data, updateData } = useBeerWizardStore();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Review your beer</h2>

      {/* Basic Info */}
      <div className="border p-4 space-y-2">
        <h3 className="font-semibold">Basic Info</h3>

        <p>
          <span className="font-medium">Name:</span> {data.name}
        </p>
        <p>
          <span className="font-medium">Country name:</span>{" "}
          {data.country?.name}
        </p>
        <p>
          <span className="font-medium">Brewery name:</span>{" "}
          {data.brewery?.name}
        </p>
        <p>
          <span className="font-medium">Style ID:</span> {data.style?.name}
        </p>
        <p>
          <span className="font-medium">Volume:</span> {data.volumeMl} ml
        </p>
      </div>

      {/* Characteristics */}
      <div className="border p-4 space-y-2">
        <h3 className="font-semibold">Characteristics</h3>

        <p>
          <span className="font-medium">ABV:</span>{" "}
          {data.abv !== null ? `${data.abv}%` : "Not provided"}
        </p>
        <p>
          <span className="font-medium">IBU:</span> {data.ibu ?? "Not provided"}
        </p>
        <p>
          <span className="font-medium">EBU:</span> {data.ebu ?? "Not provided"}
        </p>
        <p>
          <span className="font-medium">EBC:</span> {data.ebc ?? "Not provided"}
        </p>
        <p>
          <span className="font-medium">EAN:</span>{" "}
          {data.eanBarcode || "Not provided"}
        </p>
      </div>

      <div className="border p-4 space-y-3">
        <h3 className="font-semibold">Your rating (optional)</h3>

        <BeerRating
          value={data.rating ?? 0}
          onChange={(rating) => updateData({ rating })}
        />

        <p className="text-sm text-gray-600">
          {data.rating === null
            ? "Tap a beer mug to rate this beer, or leave it unrated."
            : `You rated this beer ${data.rating}/5`}
        </p>

        {data.rating !== null && (
          <button
            type="button"
            onClick={() => updateData({ rating: null })}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Clear rating
          </button>
        )}
      </div>

      {/* Image */}
      <div className="border p-4 space-y-2">
        <h3 className="font-semibold">Image</h3>

        {data.image ? (
          <img
            src={URL.createObjectURL(data.image)}
            alt="Beer preview"
            className="max-h-64 object-contain"
          />
        ) : (
          <p className="text-gray-500">No image uploaded</p>
        )}
      </div>

      {/* Final note */}
      <div className="text-sm text-gray-500">
        Check everything before submitting. You can go back to edit any step.
      </div>
    </div>
  );
}
