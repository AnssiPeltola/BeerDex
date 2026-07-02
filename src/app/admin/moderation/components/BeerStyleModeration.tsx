import Link from "next/link";

import { getPendingBeerStyles } from "@/repositories/beer-style.repository";

function formatDate(value: Date | null) {
  if (!value) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

export async function BeerStyleModeration() {
  const styles = await getPendingBeerStyles();

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">
          Pending Beer Styles
        </h2>
        <p className="text-sm text-slate-600">
          Review style submissions before they are published.
        </p>
      </div>

      {styles.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-500">
          No pending beer styles found.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {styles.map((style) => (
            <Link
              key={style.id}
              href={`/admin/moderation/styles/${style.id}`}
              className="group grid gap-4 border-b border-slate-100 p-4 transition-colors hover:bg-slate-50 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-center last:border-b-0"
            >
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-slate-900">
                  {style.name}
                </h3>
              </div>

              <div className="space-y-1 text-sm text-slate-600">
                <p>Created by {style.createdByUser?.username ?? "Unknown"}</p>
                <p>{formatDate(style.createdAt)}</p>
              </div>

              <span className="inline-flex flex-none items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-semibold text-slate-900 shadow-sm transition-colors group-hover:border-slate-300 group-hover:bg-slate-50">
                Review
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
