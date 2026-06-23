"use client";

import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import {
  useBeerStyleWizardStore,
  type BeerStyleDTO,
} from "@/stores/beer-style-wizard-store";
import AddBeerStyleModal from "@/components/beer-wizard/modals/AddBeerStyleModal";

type Props = {
  value?: number | null;
  onChange: (styleId: number | null) => void;
};

export default function BeerStyleAutocomplete({ value, onChange }: Props) {
  const { beerStyles, setBeerStyles, loading, setLoading, addBeerStyle } =
    useBeerStyleWizardStore();

  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<BeerStyleDTO | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const debounced = useDebounce(input, 200);

  // Load once
  useEffect(() => {
    if (beerStyles.length > 0) return;

    const load = async () => {
      setLoading(true);

      const res = await fetch("/api/beer-styles");
      const data: BeerStyleDTO[] = await res.json();

      setBeerStyles(data);
      setLoading(false);
    };

    load();
  }, [beerStyles.length, setBeerStyles, setLoading]);

  // Local filtering
  const filtered = useMemo(() => {
    if (!debounced) return beerStyles;

    return beerStyles.filter((s) =>
      s.name.toLowerCase().includes(debounced.toLowerCase()),
    );
  }, [debounced, beerStyles]);

  return (
    <div className="relative w-full">
      {/* INPUT */}
      <input
        className="w-full border p-2"
        placeholder="Select beer style..."
        value={selected ? selected.name : input}
        onChange={(e) => {
          setInput(e.target.value);
          setSelected(null);
          onChange(null);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
      />

      {/* DROPDOWN */}
      {open && (
        <div className="absolute z-10 w-full border bg-white max-h-60 overflow-auto">
          {loading && (
            <div className="p-2 text-gray-500">Loading styles...</div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="p-2 text-gray-500">No styles found</div>
          )}

          {!loading &&
            filtered.map((style) => (
              <div
                key={style.id}
                className="cursor-pointer p-2 hover:bg-gray-100 flex justify-between"
                onClick={() => {
                  setSelected(style);
                  setInput(style.name);
                  setOpen(false);
                  onChange(style.id);
                }}
              >
                <span>{style.name}</span>

                {style.status === "pending" && (
                  <span className="text-xs text-gray-500">⏳ Pending</span>
                )}
              </div>
            ))}

          {/* ADD NEW STYLE */}
          <div
            className="p-2 border-t cursor-pointer hover:bg-gray-100 text-blue-600"
            onMouseDown={(e) => {
              e.preventDefault();
              setModalOpen(true);
              setOpen(false);
            }}
          >
            + Add new style
          </div>
        </div>
      )}

      {/* MODAL */}
      <AddBeerStyleModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={(style) => {
          addBeerStyle(style);

          setSelected(style);
          setInput(style.name);
          onChange(style.id);
        }}
      />
    </div>
  );
}
