"use client";

import { useBeerWizardStore } from "@/stores/beer-wizard-store";

export default function CharacteristicsStep() {
  const { data, updateData } = useBeerWizardStore();

  const parseDecimalInput = (value: string) => {
    const normalized = value.replace(",", ".").trim();
    if (normalized === "") {
      return null;
    }

    const parsed = Number(normalized);
    return Number.isNaN(parsed) ? null : parsed;
  };

  const parseIntegerInput = (value: string) => {
    const trimmed = value.trim();

    if (trimmed === "") {
      return null;
    }

    const parsed = Number(trimmed);
    return Number.isNaN(parsed) ? null : parsed;
  };

  return (
    <div className="space-y-4">
      <input
        type="number"
        step="0.1"
        inputMode="decimal"
        className="w-full border p-2"
        placeholder="ABV (%) - Alcohol by Volume (optional)"
        value={data.abv ?? ""}
        onChange={(e) => updateData({ abv: parseDecimalInput(e.target.value) })}
      />

      <input
        type="number"
        className="w-full border p-2"
        placeholder="IBU - International Bitterness Unit (optional)"
        value={data.ibu ?? ""}
        onChange={(e) => updateData({ ibu: parseIntegerInput(e.target.value) })}
      />

      <input
        type="number"
        className="w-full border p-2"
        placeholder="EBU - European Bitterness Unit (optional)"
        value={data.ebu ?? ""}
        onChange={(e) => updateData({ ebu: parseIntegerInput(e.target.value) })}
      />

      <input
        type="number"
        className="w-full border p-2"
        placeholder="EBC - European Brewing Convention Scale (optional)"
        value={data.ebc ?? ""}
        onChange={(e) => updateData({ ebc: parseIntegerInput(e.target.value) })}
      />

      <input
        className="w-full border p-2"
        placeholder="EAN barcode (optional)"
        value={data.eanBarcode}
        onChange={(e) => updateData({ eanBarcode: e.target.value })}
      />
    </div>
  );
}
