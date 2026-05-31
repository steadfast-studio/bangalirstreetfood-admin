import { integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { packagesTable } from "./packages";

export const itineraryTable = pgTable("itinerary", {
  id: uuid("id").primaryKey().defaultRandom(),
  packageId: uuid("package_id")
    .references(() => packagesTable.id)
    .notNull(),
  day: integer("day").notNull(),
  description: text("description").notNull(),
});

export type SelectItinerary = typeof itineraryTable.$inferSelect;
export type InsertItinerary = typeof itineraryTable.$inferInsert;
