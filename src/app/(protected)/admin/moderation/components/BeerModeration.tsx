import Link from "next/link";

import { getPendingBeers } from "@/repositories/beer.repository";

function formatDate(value: Date | null) {
  if (!value) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

export async function BeerModeration() {
  const beers = await getPendingBeers();

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Pending Beers</h2>
        <p className="text-sm text-slate-600">
          Browse submissions and open one to review.
        </p>
      </div>

      {beers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-500">
          No pending beers found.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {beers.map((beer) => (
            <Link
              key={beer.id}
              href={`/admin/moderation/beers/${beer.id}`}
              className="group grid gap-4 border-b border-slate-100 p-4 transition-colors hover:bg-slate-50 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center last:border-b-0"
            >
              <div className="flex h-14 w-14 flex-none items-center justify-center overflow-hidden rounded-xl bg-slate-100">
                {beer.image ? (
                  <img
                    src={beer.image}
                    alt={beer.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                    No image
                  </span>
                )}
              </div>

              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <h3 className="truncate text-base font-semibold text-slate-900">
                    {beer.name}
                  </h3>
                  <span className="truncate text-sm text-slate-500">
                    {beer.brewery.name}
                  </span>
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
                  <span>{beer.country.name}</span>
                  <span>
                    Submitted by {beer.createdByUser?.username ?? "Unknown"}
                  </span>
                  <span>{formatDate(beer.createdAt)}</span>
                </div>
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
