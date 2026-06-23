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
        value={data.countryId}
        onChange={(id) =>
          updateData({
            countryId: id ?? undefined,
          })
        }
      />

      {/* Brewery */}
      <BreweryAutocomplete
        countryId={data.countryId ?? null}
        value={data.breweryId ?? null}
        onChange={(id) =>
          updateData({
            breweryId: id ?? undefined,
          })
        }
      />

      {/* Style */}
      <BeerStyleAutocomplete
        value={data.styleId ?? null}
        onChange={(id) =>
          updateData({
            styleId: id ?? undefined,
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
