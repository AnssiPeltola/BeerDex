"use client";

import { useRef, useState } from "react";
import { useBeerWizardStore } from "@/stores/beer-wizard-store";
import { imageSchema } from "@/validations/image";

export default function ImageUploadStep() {
  const { data, updateData } = useBeerWizardStore();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  const file = data.image;

  const handleFile = (file?: File | null) => {
    if (!file) return;

    const result = imageSchema.safeParse(file);

    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Invalid image");
      return;
    }

    setError(null);
    updateData({ image: file });
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files?.[0]);
  };

  // Image upload test
  const testUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/test-upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    console.log("UPLOAD RESULT:", data);
    alert(data.url);
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
                setError(null);
                updateData({ image: null });
              }}
            >
              Remove
            </button>
          </div>
        )}

        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/heic,image/heif"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
      <button
        className="bg-black text-white px-4 py-2"
        onClick={testUpload}
        disabled={!file}
      >
        Test Upload to Cloudinary
      </button>
    </div>
  );
}
