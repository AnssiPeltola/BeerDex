"use client";

import { useState } from "react";

type BeerImageLightboxProps = {
  src: string | null;
  alt: string;
};

export function BeerImageLightbox({ src, alt }: BeerImageLightboxProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!src) {
    return (
      <div className="flex h-80 w-full items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
        No image available
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="block w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm transition hover:border-slate-300 hover:shadow-md"
        aria-label={`Open full-size image for ${alt}`}
      >
        <div
          className="relative w-full bg-slate-100"
          style={{ paddingTop: "75%" }}
        >
          <img
            src={src}
            alt={alt}
            className="absolute inset-0 h-full w-full object-contain"
          />
        </div>
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4">
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            aria-label="Close image preview"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative z-10 flex max-h-full max-w-6xl flex-col gap-4">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="ml-auto rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur hover:bg-white/20"
            >
              Close
            </button>
            <img
              src={src}
              alt={alt}
              className="max-h-[85vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
