import { db } from "@/db";
import {
  beerImages,
  beerStyles,
  beers,
  breweries,
  countries,
  users,
} from "@/db/schema";
import { and, count, desc, eq, ilike, or } from "drizzle-orm";

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

export type PendingBeerModerationDTO = {
  id: number;
  name: string;
  abv: string | null;
  ibu: number | null;
  ebu: number | null;
  ebc: number | null;
  volumeMl: number | null;
  eanBarcode: string | null;
  imageId: number | null;
  image: string | null;
  createdAt: Date | null;
  brewery: {
    id: number;
    name: string;
  };
  country: {
    id: number;
    name: string;
  };
  style: {
    id: number;
    name: string;
  } | null;
  createdByUser: {
    id: string;
    username: string;
  } | null;
};

export async function getPendingBeers(): Promise<PendingBeerModerationDTO[]> {
  return db
    .select({
      id: beers.id,
      name: beers.name,
      abv: beers.abv,
      ibu: beers.ibu,
      ebu: beers.ebu,
      ebc: beers.ebc,
      volumeMl: beers.volumeMl,
      eanBarcode: beers.eanBarcode,
      imageId: beerImages.id,
      image: beerImages.imageUrl,
      createdAt: beers.createdAt,
      brewery: {
        id: breweries.id,
        name: breweries.name,
      },
      country: {
        id: countries.id,
        name: countries.name,
      },
      style: {
        id: beerStyles.id,
        name: beerStyles.name,
      },
      createdByUser: {
        id: users.id,
        username: users.username,
      },
    })
    .from(beers)
    .innerJoin(breweries, eq(beers.breweryId, breweries.id))
    .innerJoin(countries, eq(beers.countryId, countries.id))
    .leftJoin(beerStyles, eq(beers.styleId, beerStyles.id))
    .leftJoin(users, eq(beers.createdByUserId, users.id))
    .leftJoin(beerImages, eq(beerImages.beerId, beers.id))
    .where(eq(beers.status, "pending"))
    .orderBy(desc(beers.createdAt));
}

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
