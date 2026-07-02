import { notFound } from "next/navigation";

import { BreweryModerationReview } from "../../components/BreweryModerationReview";
import { getPendingBreweries } from "@/repositories/brewery.repository";

export default async function BreweryModerationReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const breweryId = Number(id);

  if (!Number.isInteger(breweryId)) {
    notFound();
  }

  const breweries = await getPendingBreweries();
  const brewery = breweries.find((entry) => entry.id === breweryId);

  if (!brewery) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <BreweryModerationReview brewery={brewery} />
    </div>
  );
}
