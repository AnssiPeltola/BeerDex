"use client";

import { useBeerWizardStore } from "@/stores/beer-wizard-store";

import {
  mockBreweries,
  mockCountries,
  mockStyles,
} from "@/lib/mock/beer-mock-data";

export default function BeerInfoStep() {
  const { data, updateData } = useBeerWizardStore();

  return (
    <div className="space-y-4">
      {/* Beer Name */}
      <input
        className="w-full border p-2"
        placeholder="Beer name"
        value={data.name}
        onChange={(e) => updateData({ name: e.target.value })}
      />

      {/* Country */}
      <select
        className="w-full border p-2"
        value={data.countryId ?? ""}
        onChange={(e) =>
          updateData({
            countryId: Number(e.target.value),
          })
        }
      >
        <option value="">Select country</option>
        {mockCountries.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      {/* Brewery */}
      <select
        className="w-full border p-2"
        value={data.breweryId ?? ""}
        onChange={(e) =>
          updateData({
            breweryId: Number(e.target.value),
          })
        }
      >
        <option value="">Select brewery</option>
        {mockBreweries
          .filter((b) => b.countryId === data.countryId)
          .map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
      </select>

      {/* Style */}
      <select
        className="w-full border p-2"
        value={data.styleId ?? ""}
        onChange={(e) =>
          updateData({
            styleId: Number(e.target.value),
          })
        }
      >
        <option value="">Select style</option>
        {mockStyles.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      {/* Volume */}
      <input
        type="number"
        className="w-full border p-2"
        placeholder="Volume (ml)"
        value={data.volumeMl ?? ""}
        onChange={(e) =>
          updateData({
            volumeMl: Number(e.target.value),
          })
        }
      />
    </div>
  );
}
