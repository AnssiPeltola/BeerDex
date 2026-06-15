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

  return (
    <div className="space-y-4">
      <input
        type="number"
        step="0.1"
        inputMode="decimal"
        className="w-full border p-2"
        placeholder="ABV (%)"
        value={data.abv ?? ""}
        onChange={(e) => updateData({ abv: parseDecimalInput(e.target.value) })}
      />

      <input
        type="number"
        className="w-full border p-2"
        placeholder="IBU"
        value={data.ibu ?? ""}
        onChange={(e) => updateData({ ibu: Number(e.target.value) })}
      />

      <input
        type="number"
        className="w-full border p-2"
        placeholder="EBU"
        value={data.ebu ?? ""}
        onChange={(e) => updateData({ ebu: Number(e.target.value) })}
      />

      <input
        type="number"
        className="w-full border p-2"
        placeholder="EBC"
        value={data.ebc ?? ""}
        onChange={(e) => updateData({ ebc: Number(e.target.value) })}
      />

      <input
        className="w-full border p-2"
        placeholder="EAN barcode"
        value={data.eanBarcode}
        onChange={(e) => updateData({ eanBarcode: e.target.value })}
      />
    </div>
  );
}
