import { db } from "@/db";
import { breweries } from "@/db/schema";
import { eq, inArray, and } from "drizzle-orm";

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
