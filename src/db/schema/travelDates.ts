import {
  date,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { packagesTable } from "./packages";

export const travelDatesTable = pgTable(
  "travel_dates",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    packageId: uuid("package_id")
      .notNull()
      .references(() => packagesTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }), // foreign key to packages table
    startDate: date("start_date").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    // indexes
    uniqueIndex("unique_package_start_date").on(
      table.packageId,
      table.startDate,
    ),
  ],
);

export type SelectTravelDate = typeof travelDatesTable.$inferSelect;
export type InsertTravelDate = typeof travelDatesTable.$inferInsert;
