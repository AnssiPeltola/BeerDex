import "dotenv/config";
import { defineConfig } from "drizzle-kit";

// This file is for runing Drizzle-kit commands like generate and migrate to make database schema on new database.
// Also for opening Drizzle Studio GUI -> npx drizzle-kit studio

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
