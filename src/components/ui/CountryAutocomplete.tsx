"use client";

import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";

type Country = {
  id: number;
  name: string;
};

type Props = {
  value?: number | null;
  onChange: (countryId: number | null) => void;
};

export default function CountryAutocomplete({ value, onChange }: Props) {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<Country[]>([]);
  const [selected, setSelected] = useState<Country | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const debounced = useDebounce(input, 300);

  useEffect(() => {
    const load = async () => {
      if (debounced.length < 2) {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      const res = await fetch(
        `/api/countries?search=${encodeURIComponent(debounced)}`,
      );

      const data: Country[] = await res.json();

      setResults(data);
      setLoading(false);
    };

    load();
  }, [debounced]);

  return (
    <div className="relative w-full">
      <input
        className="w-full border p-2"
        value={selected ? selected.name : input}
        placeholder="Select country..."
        onChange={(e) => {
          setInput(e.target.value);
          setSelected(null);
          onChange(null);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          setTimeout(() => {
            if (!selected) {
              setInput("");
              setResults([{ id: -1, name: "No valid country selected" }]);
              setOpen(false);
            }
          }, 150);
        }}
      />

      {open && (
        <div className="absolute z-10 w-full border bg-white max-h-60 overflow-auto">
          {loading && <div className="p-2 text-gray-500">Loading...</div>}

          {!loading && results.length === 0 && debounced.length >= 2 && (
            <div className="p-2 text-gray-500">No countries found</div>
          )}

          {!loading &&
            results.map((country) => (
              <div
                key={country.id}
                className="cursor-pointer p-2 hover:bg-gray-100"
                onClick={() => {
                  setSelected(country);
                  setInput(country.name);
                  setOpen(false);
                  setResults([]);
                  onChange(country.id); // ONLY valid value here
                }}
              >
                {country.name}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
