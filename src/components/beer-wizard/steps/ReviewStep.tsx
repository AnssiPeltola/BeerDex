"use client";

import { useBeerWizardStore } from "@/stores/beer-wizard-store";
import {
  mockCountries,
  mockBreweries,
  mockStyles,
} from "@/lib/mock/beer-mock-data";

export default function ReviewStep() {
  const { data } = useBeerWizardStore();

  // Mockdata we made for testing
  const country = mockCountries.find((c) => c.id === data.countryId);
  const brewery = mockBreweries.find((b) => b.id === data.breweryId);
  const style = mockStyles.find((s) => s.id === data.styleId);

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
          <span className="font-medium">Country ID:</span> {country?.name}
        </p>
        <p>
          <span className="font-medium">Brewery ID:</span> {brewery?.name}
        </p>
        <p>
          <span className="font-medium">Style ID:</span> {style?.name}
        </p>
        <p>
          <span className="font-medium">Volume:</span> {data.volumeMl} ml
        </p>
      </div>

      {/* Characteristics */}
      <div className="border p-4 space-y-2">
        <h3 className="font-semibold">Characteristics</h3>

        <p>
          <span className="font-medium">ABV:</span> {data.abv}%
        </p>
        <p>
          <span className="font-medium">IBU:</span> {data.ibu}
        </p>
        <p>
          <span className="font-medium">EBU:</span> {data.ebu}
        </p>
        <p>
          <span className="font-medium">EBC:</span> {data.ebc}
        </p>
        <p>
          <span className="font-medium">EAN:</span> {data.eanBarcode}
        </p>
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
