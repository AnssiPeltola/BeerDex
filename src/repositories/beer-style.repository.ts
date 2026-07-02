import { db } from "@/db";
import { beerStyles, users } from "@/db/schema";
import { desc, eq, or } from "drizzle-orm";

export type BeerStyleDTO = {
  id: number;
  name: string;
  status: "pending" | "approved" | "rejected";
};

export type PendingBeerStyleModerationDTO = {
  id: number;
  name: string;
  createdAt: Date | null;
  createdByUser: {
    id: string;
    username: string;
  } | null;
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
      or(eq(beerStyles.status, "approved"), eq(beerStyles.status, "pending")),
    )
    .orderBy(beerStyles.name);
}

export async function getPendingBeerStyles(): Promise<
  PendingBeerStyleModerationDTO[]
> {
  return db
    .select({
      id: beerStyles.id,
      name: beerStyles.name,
      createdAt: beerStyles.createdAt,
      createdByUser: {
        id: users.id,
        username: users.username,
      },
    })
    .from(beerStyles)
    .leftJoin(users, eq(beerStyles.createdByUserId, users.id))
    .where(eq(beerStyles.status, "pending"))
    .orderBy(desc(beerStyles.createdAt));
}
