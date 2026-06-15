"use client";

import { useRef } from "react";
import { useBeerWizardStore } from "@/stores/beer-wizard-store";

export default function ImageUploadStep() {
  const { data, updateData } = useBeerWizardStore();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const file = data.image;

  const handleFile = (file?: File | null) => {
    if (!file) return;

    // basic safety check
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    updateData({ image: file });
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files?.[0]);
  };

  return (
    <div className="space-y-4">
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="w-full border border-dashed border-black p-6 text-center cursor-pointer"
      >
        {!file ? (
          <p className="text-black">
            Drag & drop image here or click to upload
          </p>
        ) : (
          <div className="space-y-2">
            <img
              src={URL.createObjectURL(file)}
              alt="Preview"
              width={400}
              height={300}
              className="mx-auto max-h-64 object-contain"
            />
            <p className="text-sm">{file.name}</p>

            <button
              className="text-red-600 underline"
              onClick={(e) => {
                e.stopPropagation();
                updateData({ image: null });
              }}
            >
              Remove
            </button>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
    </div>
  );
}
