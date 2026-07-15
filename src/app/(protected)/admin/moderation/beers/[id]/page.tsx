import { notFound } from "next/navigation";

import { BeerModerationReview } from "../../components/BeerModerationReview";
import { getPendingBeers } from "@/repositories/beer.repository";

export default async function BeerModerationReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const beerId = Number(id);

  if (!Number.isInteger(beerId)) {
    notFound();
  }

  const beers = await getPendingBeers();
  const beer = beers.find((entry) => entry.id === beerId);

  if (!beer) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <BeerModerationReview beer={beer} />
    </div>
  );
}
