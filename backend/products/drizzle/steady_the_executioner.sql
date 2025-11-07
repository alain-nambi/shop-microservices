CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" varchar(1024) NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"category" varchar(128),
	"create_at" timestamp DEFAULT now() NOT NULL
);
