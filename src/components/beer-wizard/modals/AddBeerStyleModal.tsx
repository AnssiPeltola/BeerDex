"use client";

import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: (style: {
    id: number;
    name: string;
    status: "pending" | "approved";
  }) => void;
};

export default function AddBeerStyleModal({ open, onClose, onCreated }: Props) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const createStyle = async () => {
    setLoading(true);

    const res = await fetch("/api/beer-styles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
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
      <div className="bg-white p-4 w-[400px] rounded space-y-3">
        <h2 className="text-lg font-bold">Add Beer Style</h2>

        <input
          className="w-full border p-2"
          placeholder="Style name (e.g. IPA)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose}>Cancel</button>

          <button
            disabled={loading || !name}
            onClick={createStyle}
            className="bg-black text-white px-3 py-1"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
