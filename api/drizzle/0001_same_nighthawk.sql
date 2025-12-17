CREATE TYPE "public"."roles" AS ENUM('superadmin', 'standard');--> statement-breakpoint
ALTER TABLE "admins" ADD COLUMN "role" "roles" DEFAULT 'standard';