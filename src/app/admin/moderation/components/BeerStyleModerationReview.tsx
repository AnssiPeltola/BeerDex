import Link from "next/link";

import type { PendingBeerStyleModerationDTO } from "@/repositories/beer-style.repository";

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

export function BeerStyleModerationReview({
  style,
}: {
  style: PendingBeerStyleModerationDTO;
}) {
  return (
    <section className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
            Beer Style Moderation Workspace
          </h2>
          <p className="text-sm text-slate-600">
            Review the submitted style and edit the name before moderation.
          </p>
        </div>

        <Link
          href="/admin/moderation?tab=styles"
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
        >
          Back to list
        </Link>
      </div>

      <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Style Details
          </h3>
          <p className="text-sm text-slate-600">
            Edit the style name while keeping moderation metadata read-only.
          </p>
        </div>

        <div className="grid gap-6">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">
              Style Name
            </span>
            <input
              type="text"
              defaultValue={style.name}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            />
          </label>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="grid gap-0 md:grid-cols-2 md:gap-x-8">
            <DetailRow
              label="Created By"
              value={style.createdByUser?.username ?? "Unknown"}
            />
            <DetailRow label="Created At" value={formatDate(style.createdAt)} />
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-4">
          <button
            type="button"
            className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Approve Style
          </button>
          <button
            type="button"
            className="rounded-full bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-700"
          >
            Reject Style
          </button>
        </div>
      </section>
    </section>
  );
}
