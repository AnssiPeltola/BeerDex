"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PaginationControls } from "@/components/ui/pagination-controls";

type BeerSearchResult = {
  id: number;
  name: string;
  breweryName: string;
  countryName: string;
  volumeMl: number | null;
  abv: string | null;
  eanBarcode: string | null;
  status: "pending" | "approved";
};

type BeerSearchResponse = {
  beers: BeerSearchResult[];
  totalCount: number;
};

type AddBeerToCollectionResponse =
  | {
      success: true;
      collectionEntry: {
        beerId: number;
        collectedAt: string | null;
      };
    }
  | {
      error: string;
    };

async function searchBeers({
  query,
  page,
  limit,
}: {
  query: string;
  page: number;
  limit: number;
}): Promise<BeerSearchResponse> {
  const params = new URLSearchParams({
    q: query,
    page: String(page),
    limit: String(limit),
  });

  const res = await fetch(`/api/beers/search?${params.toString()}`);

  if (!res.ok) {
    throw new Error("Search failed");
  }

  return res.json();
}

const RESULTS_PER_PAGE = 10;

export default function AddBeerPage() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [searchedQuery, setSearchedQuery] = useState("");
  const [results, setResults] = useState<BeerSearchResult[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [searched, setSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addedBeerIds, setAddedBeerIds] = useState<Set<number>>(new Set());
  const [addingBeerIds, setAddingBeerIds] = useState<Set<number>>(new Set());

  const totalPages = Math.ceil(totalCount / RESULTS_PER_PAGE);

  async function runSearch(searchQuery: string, page: number) {
    const trimmedQuery = searchQuery.trim();

    if (!trimmedQuery) {
      setResults([]);
      setTotalCount(0);
      setSearchedQuery("");
      setSearched(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await searchBeers({
        query: trimmedQuery,
        page,
        limit: RESULTS_PER_PAGE,
      });

      setResults(response.beers);
      setTotalCount(response.totalCount);
      setSearchedQuery(trimmedQuery);
      setCurrentPage(page);
      setSearched(true);
    } catch {
      setError("Something went wrong while searching. Please try again.");
      setResults([]);
      setTotalCount(0);
      setSearched(true);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSearch() {
    await runSearch(query, 1);
  }

  function handleClear() {
    setQuery("");
    setResults([]);
    setTotalCount(0);
    setSearchedQuery("");
    setSearched(false);
    setError(null);
  }

  async function goToPage(page: number) {
    if (page < 1 || page > totalPages) return;

    await runSearch(searchedQuery, page);
  }

  async function handleAddToCollection(beerId: number) {
    if (addedBeerIds.has(beerId) || addingBeerIds.has(beerId)) {
      return;
    }

    setAddingBeerIds((prev) => {
      const next = new Set(prev);
      next.add(beerId);
      return next;
    });

    try {
      const res = await fetch("/api/beers/my-collection/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ beerId }),
      });

      if (res.status === 201) {
        setAddedBeerIds((prev) => {
          const next = new Set(prev);
          next.add(beerId);
          return next;
        });
        return;
      }

      if (res.status === 409) {
        setAddedBeerIds((prev) => {
          const next = new Set(prev);
          next.add(beerId);
          return next;
        });
        return;
      }

      const data = (await res
        .json()
        .catch(() => null)) as AddBeerToCollectionResponse | null;

      throw new Error(
        data && "error" in data ? data.error : "Failed to add beer",
      );
    } catch {
      setError("Something went wrong while adding the beer. Please try again.");
    } finally {
      setAddingBeerIds((prev) => {
        const next = new Set(prev);
        next.delete(beerId);
        return next;
      });
    }
  }

  function handleAddNewBeer() {
    router.push("/beers/new");
  }

  const firstVisibleResult = (currentPage - 1) * RESULTS_PER_PAGE + 1;
  const lastVisibleResult = Math.min(
    currentPage * RESULTS_PER_PAGE,
    totalCount,
  );

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Add Beer to Collection</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Search by beer name, brewery, or EAN barcode.
          </p>
        </div>

        <div className="flex gap-2">
          <label htmlFor="beer-search" className="sr-only">
            Beer name, brewery, or EAN barcode
          </label>

          <input
            id="beer-search"
            type="text"
            placeholder="Beer name, brewery, or EAN barcode..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleSearch();
              }
            }}
            className="flex-1 rounded-md border px-3 py-2"
          />

          <button
            type="button"
            onClick={handleSearch}
            disabled={isLoading || !query.trim()}
            className="rounded-md border px-4 py-2 disabled:opacity-50"
          >
            {isLoading ? "Searching..." : "Search"}
          </button>

          {searched && (
            <button
              type="button"
              onClick={handleClear}
              className="rounded-md border px-4 py-2"
            >
              Clear
            </button>
          )}
        </div>

        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        {searched && !error && (
          <div className="space-y-4">
            <p className="text-sm font-medium">
              {totalCount === 0
                ? `No beers found for "${searchedQuery}"`
                : `Found ${totalCount} beer${
                    totalCount === 1 ? "" : "s"
                  } for "${searchedQuery}"`}
            </p>

            <div className="rounded-lg border p-6">
              <h2 className="font-semibold">Can&apos;t find the beer?</h2>

              <p className="mt-2 text-sm text-muted-foreground">
                If the beer you searched for is not listed, you can be the first
                BeerDex explorer to discover it.
              </p>

              <button
                type="button"
                onClick={handleAddNewBeer}
                className="mt-4 rounded-md border px-4 py-2"
              >
                Add New Beer
              </button>
            </div>
          </div>
        )}

        {searched && !error && totalCount > 0 && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Showing {firstVisibleResult}-{lastVisibleResult} of {totalCount}{" "}
              results. Try a more specific name or EAN barcode if needed.
            </p>

            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
            />

            <div
              aria-busy={isLoading}
              className={isLoading ? "opacity-50" : undefined}
            >
              {results.map((beer) => {
                const isAdded = addedBeerIds.has(beer.id);
                const isAdding = addingBeerIds.has(beer.id);

                return (
                  <div
                    key={beer.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 font-medium">
                        <span>{beer.name}</span>

                        {beer.status === "pending" && (
                          <span className="text-xs text-yellow-600 border border-yellow-300 px-1 rounded">
                            Pending
                          </span>
                        )}
                      </div>

                      <div className="text-sm text-muted-foreground">
                        {beer.breweryName} • {beer.countryName}
                        {beer.volumeMl ? ` • ${beer.volumeMl}ml` : ""}
                        {beer.abv ? ` • ${beer.abv}%` : ""}
                      </div>

                      {beer.eanBarcode && (
                        <div className="mt-1 text-xs text-muted-foreground">
                          EAN: {beer.eanBarcode}
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => void handleAddToCollection(beer.id)}
                      disabled={isAdded || isAdding}
                      className="rounded-md border px-3 py-2 disabled:opacity-50"
                    >
                      {isAdding
                        ? "Adding..."
                        : isAdded
                          ? "Added ✓"
                          : "Add to Collection"}
                    </button>
                  </div>
                );
              })}
            </div>

            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
