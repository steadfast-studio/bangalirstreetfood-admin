CREATE TABLE "packages" (
	"id" uuid PRIMARY KEY NOT NULL,
	"package_title" text NOT NULL,
	"package_description" text NOT NULL,
	"package_duration" varchar(25) NOT NULL,
	"amount_per_child_in_inr" integer NOT NULL,
	"amount_per_adult_in_inr" integer NOT NULL,
	"minimum_booking_amount_per_person_in_inr" integer NOT NULL,
	"highlights" text[] NOT NULL,
	"max_group_size" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" uuid PRIMARY KEY NOT NULL,
	"travel_date_id" uuid NOT NULL,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"customer_first_name" text NOT NULL,
	"customer_last_name" text NOT NULL,
	"customer_email" text NOT NULL,
	"customer_phone" varchar(20) NOT NULL,
	"customer_whatsapp" varchar(20),
	"additional_request" text,
	"no_of_adults" integer NOT NULL,
	"no_of_children" integer DEFAULT 0 NOT NULL,
	"total_amount_payable" integer NOT NULL,
	"amount_paid" integer DEFAULT 0,
	"payment_status" text DEFAULT 'PENDING' NOT NULL,
	"razorpay_order_id" text NOT NULL,
	"razorpay_payment_id" text,
	"razorpay_signature" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "check_no_of_people" CHECK ("bookings"."no_of_adults" > 0 AND "bookings"."no_of_children" >= 0)
);
--> statement-breakpoint
CREATE TABLE "travel_dates" (
	"id" uuid PRIMARY KEY NOT NULL,
	"package_id" uuid NOT NULL,
	"start_date" date NOT NULL,
	"total_seats" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_travel_date_id_travel_dates_id_fk" FOREIGN KEY ("travel_date_id") REFERENCES "public"."travel_dates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "travel_dates" ADD CONSTRAINT "travel_dates_package_id_packages_id_fk" FOREIGN KEY ("package_id") REFERENCES "public"."packages"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "idx_travel_date_id" ON "bookings" USING btree ("travel_date_id");--> statement-breakpoint
CREATE INDEX "idx_status_created_at" ON "bookings" USING btree ("status","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_package_start_date" ON "travel_dates" USING btree ("package_id","start_date");