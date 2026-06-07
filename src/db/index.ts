import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

// Database connection setup.
// Creates and exports the Drizzle client used throughout the application.

const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle(sql, { schema });
