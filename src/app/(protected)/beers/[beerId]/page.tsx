import Image from "next/image";
import { notFound } from "next/navigation";

import { getBeerById } from "@/repositories/beer.repository";

function formatDate(date: Date | null) {
  if (!date) return null;

  return new Intl.DateTimeFormat("fi-FI", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export default async function BeerPage({
  params,
}: {
  params: Promise<{ beerId: string }>;
}) {
  const { beerId } = await params;

  // Prevents /beers/abc or /beers/-1
  const id = Number.parseInt(beerId, 10);
  if (Number.isNaN(id) || id < 1) {
    notFound();
  }

  const beer = await getBeerById(id);

  // if not found next.js looks nearest not-found.tsx file and renders it (app\beers\[beerId]\not-found.tsx)
  if (!beer) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="grid gap-8 md:grid-cols-[300px_1fr]">
        {/* Beer image */}
        <div className="relative aspect-square overflow-hidden rounded-lg border bg-gray-100">
          <Image
            src={beer.imageUrl ?? "/placeholder_beer.webp"}
            alt={beer.beerName}
            fill
            sizes="(max-width: 768px) 100vw, 300px"
            className="object-cover"
            priority
          />
        </div>

        <div>
          {/* Header */}
          <h1 className="text-3xl font-bold">{beer.beerName}</h1>

          <div className="mt-3 space-y-1 text-gray-600">
            <p>
              <span className="font-medium">Brewery:</span> {beer.breweryName}
            </p>

            <p>
              <span className="font-medium">Country:</span> {beer.countryName}
            </p>

            {beer.styleName && (
              <p>
                <span className="font-medium">Style:</span> {beer.styleName}
              </p>
            )}
          </div>

          {/* Beer information */}
          <div className="mt-8">
            <h2 className="mb-3 text-xl font-semibold">Beer information</h2>

            <div className="space-y-2">
              {beer.abv && <InfoRow label="ABV" value={`${beer.abv}%`} />}

              {beer.ibu !== null && <InfoRow label="IBU" value={beer.ibu} />}

              {beer.ebu !== null && <InfoRow label="EBU" value={beer.ebu} />}

              {beer.ebc !== null && <InfoRow label="EBC" value={beer.ebc} />}

              {beer.volumeMl !== null && (
                <InfoRow label="Volume" value={`${beer.volumeMl} ml`} />
              )}

              {beer.eanBarcode && (
                <InfoRow label="EAN barcode" value={beer.eanBarcode} />
              )}
            </div>
          </div>

          {/* Community information */}
          <div className="mt-8">
            <h2 className="mb-3 text-xl font-semibold">
              Community information
            </h2>

            <div className="space-y-2">
              {beer.createdByUsername && (
                <InfoRow label="Found by" value={beer.createdByUsername} />
              )}

              {beer.createdAt && (
                <InfoRow label="Found at" value={formatDate(beer.createdAt)} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex border-b py-2">
      <div className="w-36 font-medium">{label}</div>
      <div>{value}</div>
    </div>
  );
}
