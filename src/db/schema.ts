import {
  pgTable,
  pgEnum,
  uuid,
  text,
  timestamp,
  serial,
  varchar,
  char,
  integer,
  decimal,
  unique,
} from "drizzle-orm/pg-core";

// Drizzle database schema.
// Defines the TypeScript representation of PostgreSQL tables and enums.

// Create new table in neon console then add new variable here to match it

// DB setup (run only for fresh databases):
// npx drizzle-kit generate
// npx drizzle-kit migrate

export const userRole = pgEnum("user_role", ["user", "admin"]);
export const approvalStatus = pgEnum("approval_status", [
  "pending",
  "approved",
  "rejected",
]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: userRole("role").notNull().default("user"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const countries = pgTable("countries", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  isoCode: char("iso_code", { length: 2 }).notNull().unique(),
});

export const breweries = pgTable(
  "breweries",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 150 }).notNull(),
    countryId: integer("country_id")
      .notNull()
      .references(() => countries.id),
    status: approvalStatus("status").notNull().default("pending"),
    createdByUserId: uuid("created_by_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    verifiedByAdminId: uuid("verified_by_admin_id").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    verifiedAt: timestamp("verified_at", { withTimezone: true }),
  },
  (table) => [unique().on(table.name, table.countryId)],
);

export const beerStyles = pgTable("beer_styles", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  status: approvalStatus("status").notNull().default("pending"),
  createdByUserId: uuid("created_by_user_id").references(() => users.id, {
    onDelete: "set null",
  }),
  verifiedByAdminId: uuid("verified_by_admin_id").references(() => users.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  verifiedAt: timestamp("verified_at", { withTimezone: true }),
});

export const beers = pgTable(
  "beers",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 150 }).notNull(),

    breweryId: integer("brewery_id")
      .notNull()
      .references(() => breweries.id),

    countryId: integer("country_id")
      .notNull()
      .references(() => countries.id),

    styleId: integer("style_id").references(() => beerStyles.id),

    abv: decimal("abv", { precision: 4, scale: 2 }),
    ibu: integer("ibu"),
    ebu: integer("ebu"),
    ebc: integer("ebc"),
    volumeMl: integer("volume_ml"),

    eanBarcode: varchar("ean_barcode", { length: 32 }).unique(),

    createdByUserId: uuid("created_by_user_id").references(() => users.id, {
      onDelete: "set null",
    }),

    status: approvalStatus("status").notNull().default("pending"),

    verifiedByAdminId: uuid("verified_by_admin_id").references(() => users.id, {
      onDelete: "set null",
    }),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    verifiedAt: timestamp("verified_at", { withTimezone: true }),
  },
  (table) => [unique().on(table.name, table.breweryId, table.volumeMl)],
);

export const beerImages = pgTable("beer_images", {
  id: serial("id").primaryKey(),

  beerId: integer("beer_id")
    .notNull()
    .references(() => beers.id, { onDelete: "cascade" }),

  uploadedByUserId: uuid("uploaded_by_user_id").references(() => users.id, {
    onDelete: "set null",
  }),

  imageUrl: text("image_url").notNull(),
  cloudinaryPublicId: text("cloudinary_public_id"),

  fileName: varchar("file_name", { length: 255 }),
  mimeType: varchar("mime_type", { length: 100 }),

  status: approvalStatus("status").notNull().default("pending"),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),

  verifiedByAdminId: uuid("verified_by_admin_id").references(() => users.id, {
    onDelete: "set null",
  }),

  verifiedAt: timestamp("verified_at", { withTimezone: true }),
});

export const userBeers = pgTable(
  "user_beers",
  {
    id: serial("id").primaryKey(),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    beerId: integer("beer_id")
      .notNull()
      .references(() => beers.id, { onDelete: "cascade" }),

    foundAt: timestamp("found_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [unique().on(table.userId, table.beerId)],
);
