"use client";

import { useState } from "react";
import CountryAutocomplete from "@/components/ui/CountryAutocomplete";

type Props = {
  open: boolean;
  countryId: number;
  onClose: () => void;
  onCreated: (brewery: {
    id: number;
    name: string;
    status: "pending" | "approved";
  }) => void;
};

export default function AddBreweryModal({
  open,
  countryId: initialCountryId,
  onClose,
  onCreated,
}: Props) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [countryId, setCountryId] = useState<number | null>(initialCountryId);

  if (!open) return null;

  const createBrewery = async () => {
    if (!countryId) return;

    setLoading(true);

    const res = await fetch("/api/breweries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        countryId,
      }),
    });

    if (!res.ok) {
      setLoading(false);
      return;
    }

    const data = await res.json();

    onCreated(data);

    setName("");
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-4 w-[420px] rounded space-y-3">
        <h2 className="text-lg font-bold">Add Brewery</h2>

        {/* COUNTRY */}
        <div>
          <label className="text-sm text-gray-600">Country</label>
          <CountryAutocomplete
            value={countryId}
            onChange={(id) => setCountryId(id)}
          />
        </div>

        {/* BREWERY NAME */}
        <input
          className="w-full border p-2"
          placeholder="Brewery name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* ACTIONS */}
        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose}>Cancel</button>

          <button
            disabled={loading || !name || !countryId}
            onClick={createBrewery}
            className="bg-black text-white px-3 py-1"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
