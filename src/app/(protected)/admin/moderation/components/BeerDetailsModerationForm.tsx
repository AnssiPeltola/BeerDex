"use client";

import { approveBeer } from "../actions/approveBeer";
import { rejectBeer } from "../actions/rejectBeer";
import type { PendingBeerModerationDTO } from "@/repositories/beer.repository";
import { DetailRow } from "./DetailRow";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import {
  initialModerationActionState,
  type ModerationActionState,
} from "../actions/moderationActionState";

type BeerDetailsModerationFormProps = {
  beer: PendingBeerModerationDTO;
};

function formatDate(value: Date | null) {
  if (!value) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

async function moderateBeer(
  prevState: ModerationActionState,
  formData: FormData,
): Promise<ModerationActionState> {
  const intent = formData.get("intent");

  if (intent === "approve") {
    const result = await approveBeer(prevState, formData);
    return result.success ? result : { ...result, status: prevState.status };
  }

  if (intent === "reject") {
    const result = await rejectBeer(prevState, formData);
    return result.success ? result : { ...result, status: prevState.status };
  }

  return prevState;
}

export function BeerDetailsModerationForm({
  beer,
}: BeerDetailsModerationFormProps) {
  const [state, formAction, isPending] = useActionState(
    moderateBeer,
    initialModerationActionState,
  );

  useEffect(() => {
    if (!state.message) return;

    if (state.success) {
      toast.success(state.message);
    } else {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">Beer Details</h3>
        <p className="text-sm text-slate-600">
          Edit beer fields while keeping related moderation data read-only.
        </p>
      </div>

      <form action={formAction} className="space-y-6">
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
            name="intent"
            value="approve"
            disabled={state.status === "approved" || isPending}
            className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "Working…" : "Approve Beer"}
          </button>
          <button
            type="submit"
            name="intent"
            value="reject"
            disabled={state.status === "rejected" || isPending}
            className="rounded-full bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "Working…" : "Reject Beer"}
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
  );
}
