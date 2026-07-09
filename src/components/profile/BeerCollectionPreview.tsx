import Image from "next/image";
import Link from "next/link";
import type { UserBeerCollectionPreviewDTO } from "@/repositories/beer.repository";

type Props = {
  beers: UserBeerCollectionPreviewDTO[];
};

export default function BeerCollectionPreview({ beers }: Props) {
  return (
    <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            My Beer Collection
          </h2>

          <p className="text-sm text-slate-500">
            {`Last ${beers.length} beers you've added.`}
          </p>
        </div>

        <Link
          href="/profile/collection"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          View all →
        </Link>
      </div>

      {beers.length === 0 ? (
        <p className="text-sm text-slate-500">
          {`You haven't added any beers yet.`}
        </p>
      ) : (
        <div className="space-y-4">
          {beers.map((beer) => (
            <div
              key={beer.beerId}
              className="flex items-center gap-4 rounded-xl border border-slate-200 p-3 transition hover:bg-slate-50"
            >
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                {beer.imageUrl ? (
                  <Image
                    src={beer.imageUrl}
                    alt={beer.beerName}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-slate-400">
                    No image
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="truncate font-semibold text-slate-900">
                  {beer.beerName}
                </h3>

                <p className="truncate text-sm text-slate-600">
                  {beer.breweryName} • {beer.countryName}
                </p>

                <p className="text-sm text-slate-500">
                  {beer.styleName ?? "Unknown style"}

                  {beer.abv && <> • {beer.abv}%</>}

                  {beer.volumeMl && <> • {beer.volumeMl} ml</>}
                </p>
              </div>

              <div className="text-right text-xs text-slate-500">
                {beer.collectedAt
                  ? new Date(beer.collectedAt).toLocaleDateString()
                  : "Unknown"}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
