import { db } from "@/db";
import { breweries, countries, users } from "@/db/schema";
import { and, desc, eq, inArray } from "drizzle-orm";

export type PendingBreweryModerationDTO = {
  id: number;
  name: string;
  createdAt: Date | null;
  country: {
    id: number;
    name: string;
  };
  createdByUser: {
    id: string;
    username: string;
  } | null;
};

/**
 * Loads all visible breweries for a country.
 * Includes approved + pending.
 * Excludes rejected.
 */
export async function getBreweriesByCountry(countryId: number) {
  return db
    .select({
      id: breweries.id,
      name: breweries.name,
      status: breweries.status,
    })
    .from(breweries)
    .where(
      and(
        eq(breweries.countryId, countryId),
        inArray(breweries.status, ["approved", "pending"]),
      ),
    )
    .orderBy(breweries.name);
}

export async function getPendingBreweries(): Promise<
  PendingBreweryModerationDTO[]
> {
  return db
    .select({
      id: breweries.id,
      name: breweries.name,
      createdAt: breweries.createdAt,
      country: {
        id: countries.id,
        name: countries.name,
      },
      createdByUser: {
        id: users.id,
        username: users.username,
      },
    })
    .from(breweries)
    .innerJoin(countries, eq(breweries.countryId, countries.id))
    .leftJoin(users, eq(breweries.createdByUserId, users.id))
    .where(eq(breweries.status, "pending"))
    .orderBy(desc(breweries.createdAt));
}
