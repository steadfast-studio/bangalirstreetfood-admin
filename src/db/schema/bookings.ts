import {
  check,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { travelDatesTable } from "./travelDates";
import { sql } from "drizzle-orm";

export const bookingsTable = pgTable(
  "bookings",
  {
    id: uuid("id").primaryKey(),
    travelDateId: uuid("travel_date_id")
      .notNull()
      .references(() => travelDatesTable.id), // foreign key to travel dates table

    status: text("status").notNull().default("PENDING"), // booking status: PENDING, CONFIRMED, CANCELLED

    customerFirstName: text("customer_first_name").notNull(),
    customerLastName: text("customer_last_name").notNull(),
    customerEmail: text("customer_email").notNull(),
    customerPhone: varchar("customer_phone", { length: 20 }).notNull(),
    customerWhatsapp: varchar("customer_whatsapp", { length: 20 }),
    additionalRequest: text("additional_request"),

    noOfAdults: integer("no_of_adults").notNull(),
    noOfChildren: integer("no_of_children").notNull().default(0),

    totalAmountPayable: integer("total_amount_payable").notNull(), // in INR

    // payment details
    amountPaid: integer("amount_paid").default(0).notNull(), // in INR
    paymentStatus: text("payment_status").notNull().default("PENDING"),
    razorpayOrderId: text("razorpay_order_id").notNull(),
    razorpayPaymentId: text("razorpay_payment_id"),
    razorpaySignature: text("razorpay_signature"),

    // for passwordless login and booking management
    secretToken: varchar("secret_token", { length: 64 })
      .notNull()
      .default("abc"),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("idx_travel_date_id").on(table.travelDateId),
    index("idx_status_created_at").on(table.status, table.createdAt),
    check(
      "check_no_of_people",
      sql`${table.noOfAdults} > 0 AND ${table.noOfChildren} >= 0`,
    ), // ensure no of adults and children are non-negative
  ],
);

export type SelectBooking = typeof bookingsTable.$inferSelect;
export type InsertBooking = typeof bookingsTable.$inferInsert;

// On booking creation:
// status = PENDING
// paymentStatus = PENDING
// amountPaid = 0
// razorpayOrderId exists
// On webhook success:
// paymentStatus = SUCCESS
// status = CONFIRMED
// amountPaid = actual amount
// razorpayPaymentId saved
// razorpaySignature saved
// On webhook failure:
// paymentStatus = FAILED
// status = FAILED
