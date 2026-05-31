import {
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const packagesTable = pgTable("packages", {
  id: uuid("id").primaryKey().defaultRandom(),
  packageTitle: text("package_title").notNull(),
  packageDescription: text("package_description").notNull(),
  duration: varchar("package_duration", { length: 25 }).notNull(), // 3 Nights, 4 Days
  amountPerChild: integer("amount_per_child_in_inr").notNull(), // in INR
  amountPerAdult: integer("amount_per_adult_in_inr").notNull(), // in INR
  minimumBookingAmountPerPerson: integer(
    "minimum_booking_amount_per_person_in_inr",
  ).notNull(),
  highlights: text("highlights").array().notNull(), // array of highlight strings
  included: text("included").array().notNull().default([]), // what's included in the package
  excluded: text("excluded").array().notNull().default([]), // what's not included in the package
  notes: text("notes"), // additional notes for the package
  thumbnail: text("thumbnail_url"), // URL to the package thumbnail image
  images: text("image_urls").array().notNull().default([]), // array of URLs to package images
  maxGroupSize: integer("max_group_size").notNull(), // maximum number of people allowed in a group booking
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type SelectPackage = typeof packagesTable.$inferSelect;
export type InsertPackage = typeof packagesTable.$inferInsert;
