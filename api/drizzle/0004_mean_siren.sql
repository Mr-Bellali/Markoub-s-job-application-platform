CREATE TYPE "public"."status" AS ENUM('active', 'deleted');--> statement-breakpoint
ALTER TABLE "admins" ADD COLUMN "status" "status" DEFAULT 'active';--> statement-breakpoint
ALTER TABLE "admins" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "admins" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;