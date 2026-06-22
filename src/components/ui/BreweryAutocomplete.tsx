"use client";

import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import {
  useBreweryWizardStore,
  type BreweryDTO,
} from "@/stores/brewery-wizard-store";
import AddBreweryModal from "@/components/beer-wizard/modals/AddBreweryModal";

type Props = {
  countryId: number | null;
  value?: number | null;
  onChange: (breweryId: number | null) => void;
};

export default function BreweryAutocomplete({
  countryId,
  value,
  onChange,
}: Props) {
  const {
    breweriesByCountry,
    setBreweries,
    setLoading,
    loadingByCountry,
    addBrewery,
  } = useBreweryWizardStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<BreweryDTO | null>(null);

  const debounced = useDebounce(input, 200);

  const breweries = countryId ? (breweriesByCountry[countryId] ?? []) : [];

  const loading = countryId ? loadingByCountry[countryId] : false;

  // Load breweries when country changes (cached per country)
  useEffect(() => {
    if (!countryId) return;

    const existing = breweriesByCountry[countryId];
    if (existing) return;

    const load = async () => {
      setLoading(countryId, true);

      const res = await fetch(`/api/breweries?countryId=${countryId}`);
      const data: BreweryDTO[] = await res.json();

      setBreweries(countryId, data);
      setLoading(countryId, false);
    };

    load();
  }, [countryId, breweriesByCountry, setBreweries, setLoading]);

  // Local filtering
  const filtered = useMemo(() => {
    if (!debounced) return breweries;

    return breweries.filter((b) =>
      b.name.toLowerCase().includes(debounced.toLowerCase()),
    );
  }, [debounced, breweries]);

  return (
    <div className="relative w-full">
      {/* Input */}
      <input
        className="w-full border p-2"
        placeholder="Select brewery..."
        value={selected ? selected.name : input}
        disabled={!countryId}
        onChange={(e) => {
          setInput(e.target.value);
          setSelected(null);
          onChange(null);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
      />

      {!countryId && (
        <div className="text-sm text-gray-500 mt-1">Select country first</div>
      )}

      {/* Dropdown */}
      {open && countryId && (
        <div className="absolute z-10 w-full border bg-white max-h-60 overflow-auto">
          {loading && (
            <div className="p-2 text-gray-500">Loading breweries...</div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="p-2 text-gray-500">No breweries found</div>
          )}

          {!loading &&
            filtered.map((brewery) => (
              <div
                key={brewery.id}
                className="cursor-pointer p-2 hover:bg-gray-100 flex justify-between"
                onClick={() => {
                  setSelected(brewery);
                  setInput(brewery.name);
                  setOpen(false);
                  onChange(brewery.id);
                }}
              >
                <span>{brewery.name}</span>

                {brewery.status === "pending" && (
                  <span className="text-xs text-gray-500">⏳ Pending</span>
                )}
              </div>
            ))}

          {/* Add new brewery */}
          <div
            className="p-2 border-t cursor-pointer hover:bg-gray-100 text-blue-600"
            onMouseDown={(e) => {
              e.preventDefault();
              setModalOpen(true);
              setOpen(false);
            }}
          >
            + Add new brewery
          </div>
        </div>
      )}

      {/* Modal */}
      <AddBreweryModal
        open={modalOpen}
        countryId={countryId!}
        onClose={() => setModalOpen(false)}
        onCreated={(brewery) => {
          if (!countryId) return;

          addBrewery(countryId, brewery);

          setSelected(brewery);
          setInput(brewery.name);
          onChange(brewery.id);
        }}
      />
    </div>
  );
}
