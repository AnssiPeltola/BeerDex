"use client";

import { useBeerWizardStore } from "@/stores/beer-wizard-store";
import CountryAutocomplete from "@/components/ui/CountryAutocomplete";
import BreweryAutocomplete from "@/components/ui/BreweryAutocomplete";
import BeerStyleAutocomplete from "@/components/ui/BeerStyleAutocomplete";

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
      <CountryAutocomplete
        value={data.country}
        onChange={(country) =>
          updateData({
            country,
          })
        }
      />

      {/* Brewery */}
      <BreweryAutocomplete
        countryId={data.country?.id ?? null}
        value={data.brewery}
        onChange={(brewery) =>
          updateData({
            brewery,
          })
        }
      />

      {/* Style */}
      <BeerStyleAutocomplete
        value={data.style}
        onChange={(style) =>
          updateData({
            style,
          })
        }
      />

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
