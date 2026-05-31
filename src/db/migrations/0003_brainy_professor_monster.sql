ALTER TABLE "packages" ADD COLUMN "thumbnail_url" text;--> statement-breakpoint
ALTER TABLE "packages" ADD COLUMN "image_urls" text[] DEFAULT '{}' NOT NULL;