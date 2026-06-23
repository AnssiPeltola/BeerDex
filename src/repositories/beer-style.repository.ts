import { db } from "@/db";
import { beerStyles } from "@/db/schema";
import { or, eq } from "drizzle-orm";

export type BeerStyleDTO = {
  id: number;
  name: string;
  status: "pending" | "approved" | "rejected";
};

/**
 * Loads all visible beer styles.
 * Includes approved + pending.
 * Excludes rejected.
 */
export async function getBeerStyles() {
  return db
    .select({
      id: beerStyles.id,
      name: beerStyles.name,
      status: beerStyles.status,
    })
    .from(beerStyles)
    .where(
      or(
        eq(beerStyles.status, "approved"),
        eq(beerStyles.status, "pending")
      )
    )
    .orderBy(beerStyles.name);
}