ALTER TABLE "packages" ADD COLUMN "included" text[] DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE "packages" ADD COLUMN "excluded" text[] DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE "packages" ADD COLUMN "notes" text;