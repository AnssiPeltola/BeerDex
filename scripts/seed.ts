import "dotenv/config";

import { seedCountries } from "./seed-countries";

type Seeder = () => Promise<void>;

async function runSeeders(seeders: Seeder[]): Promise<void> {
  // Execute seeders in sequence so future dependencies can build on earlier data.
  for (const seeder of seeders) {
    await seeder();
  }
}

async function main(): Promise<void> {
  const seeders: Seeder[] = [seedCountries];

  await runSeeders(seeders);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
