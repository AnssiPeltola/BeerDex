import Link from "next/link";

import { approveBeer } from "../actions/approveBeer";
import { rejectBeer } from "../actions/rejectBeer";
import { approveBeerImage } from "../actions/approveBeerImage";
import { rejectBeerImage } from "../actions/rejectBeerImage";
import type { PendingBeerModerationDTO } from "@/repositories/beer.repository";

import { BeerImageLightbox } from "./BeerImageLightbox";

function formatDate(value: Date | null) {
  if (!value) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 py-2 last:border-b-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-right text-sm font-medium text-slate-900">
        {value}
      </span>
    </div>
  );
}

export function BeerModerationReview({
  beer,
}: {
  beer: PendingBeerModerationDTO;
}) {
  return (
    <section className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
            Beer Moderation Workspace
          </h2>
          <p className="text-sm text-slate-600">
            Review the submitted image and edit beer details before moderation.
          </p>
        </div>

        <Link
          href="/admin/moderation?tab=beers"
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
        >
          Back to list
        </Link>
      </div>

      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Image Moderation
          </h3>
          <p className="text-sm text-slate-600">
            Inspect the submitted image before approving the beer.
          </p>
        </div>

        <BeerImageLightbox src={beer.image} alt={beer.name} />

        <form className="flex flex-wrap gap-3 pt-1">
          <input type="hidden" name="imageId" value={beer.imageId ?? ""} />
          <button
            type="submit"
            formAction={approveBeerImage}
            disabled={!beer.imageId}
            className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Approve Image
          </button>
          <button
            type="submit"
            formAction={rejectBeerImage}
            disabled={!beer.imageId}
            className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Reject Image
          </button>
        </form>
      </section>

      <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Beer Details</h3>
          <p className="text-sm text-slate-600">
            Edit beer fields while keeping related moderation data read-only.
          </p>
        </div>

        <form className="space-y-6">
          <input type="hidden" name="beerId" value={beer.id} />

          <div className="grid gap-6 lg:grid-cols-2">
            <label className="space-y-2 lg:col-span-2">
              <span className="text-sm font-medium text-slate-700">Name</span>
              <input
                name="name"
                type="text"
                defaultValue={beer.name}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">ABV</span>
              <input
                name="abv"
                type="number"
                step="0.01"
                defaultValue={beer.abv ?? ""}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">IBU</span>
              <input
                name="ibu"
                type="number"
                defaultValue={beer.ibu ?? ""}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">EBU</span>
              <input
                name="ebu"
                type="number"
                defaultValue={beer.ebu ?? ""}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">EBC</span>
              <input
                name="ebc"
                type="number"
                defaultValue={beer.ebc ?? ""}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">
                Volume (ml)
              </span>
              <input
                name="volumeMl"
                type="number"
                defaultValue={beer.volumeMl ?? ""}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              />
            </label>

            <label className="space-y-2 lg:col-span-2">
              <span className="text-sm font-medium text-slate-700">
                EAN Barcode
              </span>
              <input
                name="eanBarcode"
                type="text"
                defaultValue={beer.eanBarcode ?? ""}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              />
            </label>
          </div>

          <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-4">
            <button
              type="submit"
              formAction={approveBeer}
              className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Approve Beer
            </button>
            <button
              type="submit"
              formAction={rejectBeer}
              className="rounded-full bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-700"
            >
              Reject Beer
            </button>
          </div>
        </form>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="grid gap-0 md:grid-cols-2 md:gap-x-8">
            <DetailRow label="Brewery" value={beer.brewery.name} />
            <DetailRow label="Style" value={beer.style?.name ?? "Unknown"} />
            <DetailRow label="Country" value={beer.country.name} />
            <DetailRow
              label="Created By"
              value={beer.createdByUser?.username ?? "Unknown"}
            />
            <DetailRow label="Created At" value={formatDate(beer.createdAt)} />
          </div>
        </div>
      </section>
    </section>
  );
}
