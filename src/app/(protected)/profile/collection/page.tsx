import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserBeerCollection } from "@/repositories/beer.repository";

const PAGE_SIZE = 20;

function formatDate(date: Date | null) {
  if (!date) return null;
  return new Intl.DateTimeFormat("fi-FI", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export default async function BeerCollectionPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  // layout.tsx already guarantees a session exists, so this is safe
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;

  const { page: pageParam } = await searchParams;
  const parsedPage = pageParam ? Number.parseInt(pageParam, 10) : 1;
  const page = Number.isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage;

  const { items, totalItems } = await getUserBeerCollection(
    userId,
    page,
    PAGE_SIZE,
  );
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">My Beer Collection</h1>

      {items.length === 0 ? (
        <p className="text-gray-500">
          You haven&apos;t collected any beers yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {items.map((beer) =>
            beer.status === "approved" ? (
              <Link
                key={beer.beerId}
                href={`/beers/${beer.beerId}`}
                className="flex gap-3 rounded-lg border border-gray-200 p-3 transition hover:bg-gray-50"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded bg-gray-100">
                  {beer.imageUrl ? (
                    <Image
                      src={beer.imageUrl}
                      alt={beer.beerName}
                      fill
                      sizes="64px"
                      className="object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                      No image
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{beer.beerName}</p>
                  <p className="truncate text-sm text-gray-600">
                    {beer.breweryName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {beer.countryName}
                    {beer.styleName ? ` · ${beer.styleName}` : ""}
                  </p>
                  <p className="text-xs text-gray-500">
                    {beer.volumeMl ? `${beer.volumeMl} ml` : ""}
                    {beer.abv ? ` · ${beer.abv}%` : ""}
                  </p>
                  {beer.collectedAt && (
                    <p className="mt-1 text-xs text-gray-400">
                      Collected {formatDate(beer.collectedAt)}
                    </p>
                  )}
                </div>
              </Link>
            ) : (
              <div
                key={beer.beerId}
                className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50/50 p-3"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded bg-gray-100">
                  <Image
                    src="/placeholder_beer.webp"
                    alt="Pending beer placeholder"
                    fill
                    sizes="64px"
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate font-semibold">{beer.beerName}</p>
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-800">
                      Pending approval
                    </span>
                  </div>
                  <p className="truncate text-sm text-gray-600">
                    {beer.breweryName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {beer.countryName}
                    {beer.styleName ? ` · ${beer.styleName}` : ""}
                  </p>
                  <p className="text-xs text-gray-500">
                    {beer.volumeMl ? `${beer.volumeMl} ml` : ""}
                    {beer.abv ? ` · ${beer.abv}%` : ""}
                  </p>
                  {beer.collectedAt && (
                    <p className="mt-1 text-xs text-gray-400">
                      Collected {formatDate(beer.collectedAt)}
                    </p>
                  )}
                </div>
              </div>
            ),
          )}
        </div>
      )}

      <p className="mt-6 text-center text-sm text-gray-600">
        Total in collection: {totalItems}
      </p>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <PaginationLink page={page - 1} disabled={page <= 1}>
            Previous
          </PaginationLink>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <PaginationLink page={page + 1} disabled={page >= totalPages}>
            Next
          </PaginationLink>
        </div>
      )}
    </div>
  );
}

function PaginationLink({
  page,
  disabled,
  children,
}: {
  page: number;
  disabled: boolean;
  children: React.ReactNode;
}) {
  if (disabled) {
    return (
      <span className="cursor-not-allowed rounded border border-gray-200 px-3 py-1 text-sm text-gray-300">
        {children}
      </span>
    );
  }
  return (
    <Link
      href={`/profile/collection?page=${page}`}
      className="rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50"
    >
      {children}
    </Link>
  );
}
