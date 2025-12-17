CREATE TABLE "admins" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "admins_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"first_name" varchar(60),
	"last_name" varchar(60),
	"email" varchar(100),
	"hashed_password" varchar,
	CONSTRAINT "admins_email_unique" UNIQUE("email")
);
