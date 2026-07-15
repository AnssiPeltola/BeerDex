import Link from "next/link";

import type { PendingBeerModerationDTO } from "@/repositories/beer.repository";

import { BeerDetailsModerationForm } from "./BeerDetailsModerationForm";
import { BeerImageModerationForm } from "./BeerImageModerationForm";

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

      <BeerImageModerationForm beer={beer} />

      <BeerDetailsModerationForm beer={beer} />
    </section>
  );
}
