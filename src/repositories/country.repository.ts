import { db } from "@/db";
import { countries } from "@/db/schema";
import { eq, ilike } from "drizzle-orm";

export async function searchCountries(search: string) {
  if (search.length < 3) {
    return [];
  }

  return db
    .select()
    .from(countries)
    .where(ilike(countries.name, `%${search}%`))
    .limit(10);
}

export async function getCountryById(id: number) {
  const [country] = await db
    .select()
    .from(countries)
    .where(eq(countries.id, id));

  return country;
}

export async function getAllCountries() {
  return db.select().from(countries).orderBy(countries.name);
}
