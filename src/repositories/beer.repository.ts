import { db } from "@/db";
import { beers, breweries, countries } from "@/db/schema";
import { and, eq, ilike, or, count } from "drizzle-orm";

export type BeerSearchDTO = {
  id: number;
  name: string;
  breweryName: string;
  countryName: string;
  volumeMl: number | null;
  abv: string | null;
  eanBarcode: string | null;
};

type SearchBeersInput = {
  q: string;
  page: number;
  limit: number;
};

export async function searchBeers({
  q,
  page,
  limit,
}: SearchBeersInput): Promise<{
  beers: BeerSearchDTO[];
  totalCount: number;
}> {
  const offset = (page - 1) * limit;

  const search = `%${q}%`;

  // MAIN QUERY
  const results = await db
    .select({
      id: beers.id,
      name: beers.name,
      breweryName: breweries.name,
      countryName: countries.name,
      volumeMl: beers.volumeMl,
      abv: beers.abv,
      eanBarcode: beers.eanBarcode,
      status: beers.status,
    })
    .from(beers)
    .innerJoin(breweries, eq(beers.breweryId, breweries.id))
    .innerJoin(countries, eq(beers.countryId, countries.id))
    .where(
      and(
        or(eq(beers.status, "approved"), eq(beers.status, "pending")),
        or(
          ilike(beers.name, search),
          ilike(breweries.name, search),
          ilike(countries.name, search),
          ilike(beers.eanBarcode, search),
        ),
      ),
    )
    .orderBy(beers.name)
    .limit(limit)
    .offset(offset);

  // COUNT QUERY (pagination)
  const totalResult = await db
    .select({ count: count() })
    .from(beers)
    .innerJoin(breweries, eq(beers.breweryId, breweries.id))
    .innerJoin(countries, eq(beers.countryId, countries.id))
    .where(
      and(
        or(eq(beers.status, "approved"), eq(beers.status, "pending")),
        or(
          ilike(beers.name, search),
          ilike(breweries.name, search),
          ilike(countries.name, search),
          ilike(beers.eanBarcode, search),
        ),
      ),
    );

  const totalCount = totalResult[0]?.count ?? 0;

  return {
    beers: results,
    totalCount,
  };
}
