CREATE TYPE "public"."worktype" AS ENUM('remote', 'hybrid', 'onsite', 'freelancer');--> statement-breakpoint
CREATE TABLE "positions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "positions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"title" varchar NOT NULL,
	"category" varchar NOT NULL,
	"workType" "worktype" DEFAULT 'onsite',
	"location" varchar,
	"description" varchar NOT NULL
);
