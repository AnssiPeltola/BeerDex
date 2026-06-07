import { pgTable, pgEnum, uuid, text, timestamp } from "drizzle-orm/pg-core";

// Drizzle database schema.
// Defines the TypeScript representation of PostgreSQL tables and enums.

// Create new table in neon console then add new variable here to match it

// DB setup (run only for fresh databases):
// npx drizzle-kit generate
// npx drizzle-kit migrate

export const userRole = pgEnum("user_role", ["user", "admin"]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: userRole("role").notNull().default("user"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});
