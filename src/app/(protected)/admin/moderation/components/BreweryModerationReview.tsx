"use client";

import Link from "next/link";
import { useState } from "react";

import CountryAutocomplete from "@/components/ui/CountryAutocomplete";
import type { CountryOption } from "@/types/beer-wizard-types";

import type { PendingBreweryModerationDTO } from "@/repositories/brewery.repository";

import { approveBrewery } from "../actions/approveBrewery";
import { rejectBrewery } from "../actions/rejectBrewery";

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

export function BreweryModerationReview({
  brewery,
}: {
  brewery: PendingBreweryModerationDTO;
}) {
  const [selectedCountry, setSelectedCountry] = useState<CountryOption | null>({
    id: brewery.country.id,
    name: brewery.country.name,
  });

  return (
    <section className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
            Brewery Moderation Workspace
          </h2>
          <p className="text-sm text-slate-600">
            Review the submitted brewery and adjust details before moderation.
          </p>
        </div>

        <Link
          href="/admin/moderation?tab=breweries"
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
        >
          Back to list
        </Link>
      </div>

      <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Brewery Details
          </h3>
          <p className="text-sm text-slate-600">
            Edit brewery fields while keeping moderation metadata read-only.
          </p>
        </div>

        <form className="space-y-6">
          <input type="hidden" name="breweryId" value={brewery.id} />
          <input
            type="hidden"
            name="countryId"
            value={selectedCountry?.id ?? ""}
          />

          <div className="grid gap-6 lg:grid-cols-2">
            <label className="space-y-2 lg:col-span-2">
              <span className="text-sm font-medium text-slate-700">
                Brewery Name
              </span>
              <input
                name="name"
                type="text"
                defaultValue={brewery.name}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              />
            </label>

            <div className="space-y-2 lg:col-span-2">
              <span className="text-sm font-medium text-slate-700">
                Country
              </span>
              <CountryAutocomplete
                value={selectedCountry}
                onChange={setSelectedCountry}
              />
            </div>
          </div>

          <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-4">
            <button
              type="submit"
              formAction={approveBrewery}
              className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Approve Brewery
            </button>
            <button
              type="submit"
              formAction={rejectBrewery}
              className="rounded-full bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-700"
            >
              Reject Brewery
            </button>
          </div>
        </form>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="grid gap-0 md:grid-cols-2 md:gap-x-8">
            <DetailRow
              label="Created By"
              value={brewery.createdByUser?.username ?? "Unknown"}
            />
            <DetailRow
              label="Created At"
              value={formatDate(brewery.createdAt)}
            />
          </div>
        </div>
      </section>
    </section>
  );
}
