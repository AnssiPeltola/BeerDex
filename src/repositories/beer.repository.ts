import { db } from "@/db";
import {
  beerImages,
  beerStyles,
  beers,
  breweries,
  countries,
  userBeers,
  users,
} from "@/db/schema";
import { and, count, desc, eq, ilike, max, or } from "drizzle-orm";

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

export type UserBeerCollectionPreviewDTO = {
  beerId: number;
  beerName: string;
  breweryName: string;
  countryName: string;
  styleName: string | null;
  volumeMl: number | null;
  abv: string | null;
  imageUrl: string | null;
  collectedAt: Date | null;
};

export type UserBeerCollectionDTO = UserBeerCollectionPreviewDTO;

export type BeerDetailsDTO = {
  beerId: number;
  beerName: string;
  breweryId: number;
  breweryName: string;
  countryId: number;
  countryName: string;
  styleId: number | null;
  styleName: string | null;
  volumeMl: number | null;
  abv: string | null;
  ibu: number | null;
  ebc: number | null;
  ebu: number | null;
  eanBarcode: string | null;
  imageUrls: string[];
  createdAt: Date | null;
};

const approvedBeerImages = db
  .select({
    beerId: beerImages.beerId,
    imageId: max(beerImages.id),
  })
  .from(beerImages)
  .where(eq(beerImages.status, "approved"))
  .groupBy(beerImages.beerId)
  .as("approved_beer_images");

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

export async function getUserBeerCollectionPreview(
  userId: string,
): Promise<UserBeerCollectionPreviewDTO[]> {
  return db
    .select({
      beerId: beers.id,
      beerName: beers.name,
      breweryName: breweries.name,
      countryName: countries.name,
      styleName: beerStyles.name,
      volumeMl: beers.volumeMl,
      abv: beers.abv,
      imageUrl: beerImages.imageUrl,
      collectedAt: userBeers.foundAt,
    })
    .from(userBeers)
    .innerJoin(beers, eq(userBeers.beerId, beers.id))
    .innerJoin(breweries, eq(beers.breweryId, breweries.id))
    .innerJoin(countries, eq(beers.countryId, countries.id))
    .leftJoin(beerStyles, eq(beers.styleId, beerStyles.id))
    .leftJoin(approvedBeerImages, eq(approvedBeerImages.beerId, beers.id))
    .leftJoin(beerImages, eq(beerImages.id, approvedBeerImages.imageId))
    .where(and(eq(userBeers.userId, userId), eq(beers.status, "approved")))
    .orderBy(desc(userBeers.foundAt))
    .limit(5);
}

export async function getUserBeerCollection(
  userId: string,
  page: number,
  pageSize: number,
): Promise<{
  items: UserBeerCollectionDTO[];
  totalItems: number;
}> {
  const offset = (page - 1) * pageSize;

  const items = await db
    .select({
      beerId: beers.id,
      beerName: beers.name,
      breweryName: breweries.name,
      countryName: countries.name,
      styleName: beerStyles.name,
      volumeMl: beers.volumeMl,
      abv: beers.abv,
      imageUrl: beerImages.imageUrl,
      collectedAt: userBeers.foundAt,
    })
    .from(userBeers)
    .innerJoin(beers, eq(userBeers.beerId, beers.id))
    .innerJoin(breweries, eq(beers.breweryId, breweries.id))
    .innerJoin(countries, eq(beers.countryId, countries.id))
    .leftJoin(beerStyles, eq(beers.styleId, beerStyles.id))
    .leftJoin(approvedBeerImages, eq(approvedBeerImages.beerId, beers.id))
    .leftJoin(beerImages, eq(beerImages.id, approvedBeerImages.imageId))
    .where(and(eq(userBeers.userId, userId), eq(beers.status, "approved")))
    .orderBy(desc(userBeers.foundAt))
    .limit(pageSize)
    .offset(offset);

  const totalResult = await db
    .select({ count: count() })
    .from(userBeers)
    .innerJoin(beers, eq(userBeers.beerId, beers.id))
    .innerJoin(breweries, eq(beers.breweryId, breweries.id))
    .innerJoin(countries, eq(beers.countryId, countries.id))
    .leftJoin(beerStyles, eq(beers.styleId, beerStyles.id))
    .leftJoin(approvedBeerImages, eq(approvedBeerImages.beerId, beers.id))
    .leftJoin(beerImages, eq(beerImages.id, approvedBeerImages.imageId))
    .where(and(eq(userBeers.userId, userId), eq(beers.status, "approved")));

  return {
    items,
    totalItems: totalResult[0]?.count ?? 0,
  };
}

export async function getBeerDetails(
  beerId: number,
): Promise<BeerDetailsDTO | null> {
  const rows = await db
    .select({
      beerId: beers.id,
      beerName: beers.name,
      breweryId: breweries.id,
      breweryName: breweries.name,
      countryId: countries.id,
      countryName: countries.name,
      styleId: beerStyles.id,
      styleName: beerStyles.name,
      volumeMl: beers.volumeMl,
      abv: beers.abv,
      ibu: beers.ibu,
      ebc: beers.ebc,
      ebu: beers.ebu,
      eanBarcode: beers.eanBarcode,
      imageUrl: beerImages.imageUrl,
      createdAt: beers.createdAt,
    })
    .from(beers)
    .innerJoin(
      breweries,
      and(eq(beers.breweryId, breweries.id), eq(breweries.status, "approved")),
    )
    .innerJoin(countries, eq(beers.countryId, countries.id))
    .leftJoin(
      beerStyles,
      and(eq(beers.styleId, beerStyles.id), eq(beerStyles.status, "approved")),
    )
    .leftJoin(
      beerImages,
      and(eq(beerImages.beerId, beers.id), eq(beerImages.status, "approved")),
    )
    .where(and(eq(beers.id, beerId), eq(beers.status, "approved")))
    .orderBy(desc(beerImages.createdAt));

  if (rows.length === 0) {
    return null;
  }

  const [firstRow] = rows;
  const imageUrls = rows
    .map((row) => row.imageUrl)
    .filter((imageUrl): imageUrl is string => Boolean(imageUrl));

  return {
    beerId: firstRow.beerId,
    beerName: firstRow.beerName,
    breweryId: firstRow.breweryId,
    breweryName: firstRow.breweryName,
    countryId: firstRow.countryId,
    countryName: firstRow.countryName,
    styleId: firstRow.styleId,
    styleName: firstRow.styleName,
    volumeMl: firstRow.volumeMl,
    abv: firstRow.abv,
    ibu: firstRow.ibu,
    ebc: firstRow.ebc,
    ebu: firstRow.ebu,
    eanBarcode: firstRow.eanBarcode,
    imageUrls,
    createdAt: firstRow.createdAt,
  };
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
