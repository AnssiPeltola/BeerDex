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
};

type BeerSearchResponse = {
  beers: BeerSearchResult[];
  totalCount: number;
};

const RESULTS_PER_PAGE = 10;

const mockBeers: BeerSearchResult[] = [
  {
    id: 101,
    name: "Karhu Lager",
    breweryName: "Sinebrychoff",
    countryName: "Finland",
    volumeMl: 330,
    abv: "4.60",
    eanBarcode: "6413600010001",
  },
  {
    id: 102,
    name: "Karhu Tumma",
    breweryName: "Sinebrychoff",
    countryName: "Finland",
    volumeMl: 330,
    abv: "4.80",
    eanBarcode: "6413600010002",
  },
  {
    id: 103,
    name: "Karhu IPA",
    breweryName: "Sinebrychoff",
    countryName: "Finland",
    volumeMl: 440,
    abv: "5.50",
    eanBarcode: "6413600010003",
  },
  {
    id: 104,
    name: "Karhu Pale Ale",
    breweryName: "Sinebrychoff",
    countryName: "Finland",
    volumeMl: 440,
    abv: "5.20",
    eanBarcode: "6413600010004",
  },
  {
    id: 105,
    name: "Karhu Pils",
    breweryName: "Sinebrychoff",
    countryName: "Finland",
    volumeMl: 500,
    abv: "4.70",
    eanBarcode: "6413600010005",
  },
  {
    id: 106,
    name: "Karhu Export",
    breweryName: "Sinebrychoff",
    countryName: "Finland",
    volumeMl: 500,
    abv: "5.30",
    eanBarcode: "6413600010006",
  },
  {
    id: 107,
    name: "Karhu Strong",
    breweryName: "Sinebrychoff",
    countryName: "Finland",
    volumeMl: 500,
    abv: "7.00",
    eanBarcode: "6413600010007",
  },
  {
    id: 108,
    name: "Karhu Amber",
    breweryName: "Sinebrychoff",
    countryName: "Finland",
    volumeMl: 440,
    abv: "5.60",
    eanBarcode: "6413600010008",
  },
  {
    id: 109,
    name: "Karhu Wheat",
    breweryName: "Sinebrychoff",
    countryName: "Finland",
    volumeMl: 500,
    abv: "5.10",
    eanBarcode: "6413600010009",
  },
  {
    id: 110,
    name: "Karhu Session IPA",
    breweryName: "Sinebrychoff",
    countryName: "Finland",
    volumeMl: 330,
    abv: "4.20",
    eanBarcode: "6413600010010",
  },
  {
    id: 111,
    name: "Karhu Double IPA",
    breweryName: "Sinebrychoff",
    countryName: "Finland",
    volumeMl: 440,
    abv: "8.00",
    eanBarcode: "6413600010011",
  },
  {
    id: 112,
    name: "Karhu Red Ale",
    breweryName: "Sinebrychoff",
    countryName: "Finland",
    volumeMl: 440,
    abv: "5.40",
    eanBarcode: "6413600010012",
  },
  {
    id: 113,
    name: "Karhu Stout",
    breweryName: "Sinebrychoff",
    countryName: "Finland",
    volumeMl: 330,
    abv: "6.20",
    eanBarcode: "6413600010013",
  },
  {
    id: 114,
    name: "Karhu Porter",
    breweryName: "Sinebrychoff",
    countryName: "Finland",
    volumeMl: 500,
    abv: "6.80",
    eanBarcode: "6413600010014",
  },
  {
    id: 115,
    name: "Karhu Hazy IPA",
    breweryName: "Sinebrychoff",
    countryName: "Finland",
    volumeMl: 440,
    abv: "5.90",
    eanBarcode: "6413600010015",
  },
  {
    id: 116,
    name: "Karhu West Coast IPA",
    breweryName: "Sinebrychoff",
    countryName: "Finland",
    volumeMl: 440,
    abv: "6.50",
    eanBarcode: "6413600010016",
  },
  {
    id: 117,
    name: "Karhu Lager Gold",
    breweryName: "Sinebrychoff",
    countryName: "Finland",
    volumeMl: 330,
    abv: "4.90",
    eanBarcode: "6413600010017",
  },
  {
    id: 118,
    name: "Karhu Premium",
    breweryName: "Sinebrychoff",
    countryName: "Finland",
    volumeMl: 500,
    abv: "5.00",
    eanBarcode: "6413600010018",
  },
  {
    id: 119,
    name: "Karhu Reserve",
    breweryName: "Sinebrychoff",
    countryName: "Finland",
    volumeMl: 500,
    abv: "6.00",
    eanBarcode: "6413600010019",
  },
  {
    id: 120,
    name: "Karhu Arctic Lager",
    breweryName: "Sinebrychoff",
    countryName: "Finland",
    volumeMl: 330,
    abv: "4.70",
    eanBarcode: "6413600010020",
  },
  {
    id: 121,
    name: "Karhu Midnight Porter",
    breweryName: "Sinebrychoff",
    countryName: "Finland",
    volumeMl: 500,
    abv: "7.10",
    eanBarcode: "6413600010021",
  },
  {
    id: 122,
    name: "Karhu Summer Ale",
    breweryName: "Sinebrychoff",
    countryName: "Finland",
    volumeMl: 440,
    abv: "4.80",
    eanBarcode: "6413600010022",
  },
];

async function searchBeers({
  query,
  page,
  limit,
}: {
  query: string;
  page: number;
  limit: number;
}): Promise<BeerSearchResponse> {
  const searchValue = query.trim().toLowerCase();

  // Simulated network latency so the loading state has something to show.
  // Remove this once a real API call is in place.
  await new Promise((resolve) => setTimeout(resolve, 300));

  // TODO: Later replace this function with real DB/API call.
  const filteredBeers = mockBeers.filter((beer) => {
    return (
      beer.name.toLowerCase().includes(searchValue) ||
      beer.breweryName.toLowerCase().includes(searchValue) ||
      beer.eanBarcode?.includes(searchValue)
    );
  });

  const startIndex = (page - 1) * limit;
  const paginatedBeers = filteredBeers.slice(startIndex, startIndex + limit);

  return {
    beers: paginatedBeers,
    totalCount: filteredBeers.length,
  };
}

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

  function handleAddToCollection(beerId: number) {
    // TODO: Replace with real API call to add beer to user's collection.
    console.log("Add beer to collection:", beerId);

    setAddedBeerIds((prev) => {
      const next = new Set(prev);
      next.add(beerId);
      return next;
    });
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

                return (
                  <div
                    key={beer.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div>
                      <div className="font-medium">{beer.name}</div>

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
                      onClick={() => handleAddToCollection(beer.id)}
                      disabled={isAdded}
                      className="rounded-md border px-3 py-2 disabled:opacity-50"
                    >
                      {isAdded ? "Added ✓" : "Add to Collection"}
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
