import { notFound } from "next/navigation";

import { BeerStyleModerationReview } from "../../components/BeerStyleModerationReview";
import { getPendingBeerStyles } from "@/repositories/beer-style.repository";

export default async function BeerStyleModerationReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const styleId = Number(id);

  if (!Number.isInteger(styleId)) {
    notFound();
  }

  const styles = await getPendingBeerStyles();
  const style = styles.find((entry) => entry.id === styleId);

  if (!style) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <BeerStyleModerationReview style={style} />
    </div>
  );
}
