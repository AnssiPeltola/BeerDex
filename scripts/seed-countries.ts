import "dotenv/config";

import { pathToFileURL } from "node:url";

import worldCountries from "world-countries";

import { db } from "../src/db";
import { countries } from "../src/db/schema";

type WorldCountrySource = {
  name?: {
    common?: string | null;
  } | null;
  cca2?: string | null;
};

type CountrySeedRow = typeof countries.$inferInsert;

const countryNameCollator = new Intl.Collator("en", {
  sensitivity: "base",
});

function mapCountryToSeedRow(
  country: WorldCountrySource,
): CountrySeedRow | null {
  // Normalize the dataset into the database shape and reject incomplete rows.
  const name = country.name?.common?.trim();
  const isoCode = country.cca2?.trim().toUpperCase();

  if (!name || !isoCode || isoCode.length !== 2) {
    return null;
  }

  return {
    name,
    isoCode,
  };
}

function dedupeCountriesByIsoCode(
  countriesToDedupe: CountrySeedRow[],
): CountrySeedRow[] {
  // Keep the first row for each ISO code so the insert payload stays stable.
  const uniqueCountries = new Map<string, CountrySeedRow>();

  for (const country of countriesToDedupe) {
    if (!uniqueCountries.has(country.isoCode)) {
      uniqueCountries.set(country.isoCode, country);
    }
  }

  return Array.from(uniqueCountries.values());
}

function sortCountriesByName(
  countriesToSort: CountrySeedRow[],
): CountrySeedRow[] {
  // Sort once before insert so the seed order is deterministic.
  return [...countriesToSort].sort((left, right) =>
    countryNameCollator.compare(left.name, right.name),
  );
}

export async function seedCountries(): Promise<void> {
  console.log("Seeding countries...");

  const processedCountries = (
    worldCountries as ReadonlyArray<WorldCountrySource>
  )
    .map(mapCountryToSeedRow)
    .filter((country): country is CountrySeedRow => country !== null);

  const uniqueCountries = dedupeCountriesByIsoCode(processedCountries);
  const countriesToInsert = sortCountriesByName(uniqueCountries);

  const insertedCountries = await db
    .insert(countries)
    .values(countriesToInsert)
    .onConflictDoNothing({ target: countries.isoCode })
    .returning({ isoCode: countries.isoCode });

  console.log(`Countries processed: ${processedCountries.length}`);
  console.log(`Countries inserted: ${insertedCountries.length}`);
  console.log("Done");
}

async function main(): Promise<void> {
  await seedCountries();
}

// Allow this file to run directly while still being importable from the master seed file.
if (
  process.argv[1] !== undefined &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  main().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
}
