CREATE TABLE IF NOT EXISTS "account" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"provider_account_id" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT account_provider_provider_account_id PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"session_token" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"password" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" timestamp (3) DEFAULT CURRENT_TIMESTAMP(3),
	"image" text,
	CONSTRAINT "user_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verification_token" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT verification_token_identifier_token PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "post" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "game" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "game_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "game_source" (
	"id" text PRIMARY KEY NOT NULL,
	"game_id" text NOT NULL,
	"source_id" text NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "game_source_game_id_source_id_unique" UNIQUE("game_id","source_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "quality" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "quality_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "skin" (
	"id" text PRIMARY KEY NOT NULL,
	"type_id" text,
	"name" text NOT NULL,
	"url" text NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "skin_name_unique" UNIQUE("name"),
	CONSTRAINT "skin_url_unique" UNIQUE("url")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "skin_quality" (
	"id" text PRIMARY KEY NOT NULL,
	"weapon_id" text NOT NULL,
	"quality_id" text NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "skin_quality_weapon_id_quality_id_unique" UNIQUE("weapon_id","quality_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "skin_quality_data" (
	"id" text PRIMARY KEY NOT NULL,
	"skin_quality_id" text NOT NULL,
	"steam_price" real,
	"steam_listings" integer,
	"steam_volume" integer,
	"steam_median_price" real,
	"bitskinsprice" real,
	"percent_change" real,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "skin_quality_data_skin_quality_id_created_at_unique" UNIQUE("skin_quality_id","created_at")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "skin_type" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "skin_type_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "source" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"url" text NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "source_name_unique" UNIQUE("name"),
	CONSTRAINT "source_url_unique" UNIQUE("url")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "source_weapon" (
	"id" text PRIMARY KEY NOT NULL,
	"weapon_id" text NOT NULL,
	"source_id" text NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "source_weapon_source_id_weapon_id_unique" UNIQUE("source_id","weapon_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "weapon" (
	"id" text PRIMARY KEY NOT NULL,
	"type_id" text,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "weapon_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "weapon_skin" (
	"id" text PRIMARY KEY NOT NULL,
	"weapon_id" text NOT NULL,
	"skin_id" text NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "weapon_skin_weapon_id_skin_id_unique" UNIQUE("weapon_id","skin_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "weapon_type" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "weapon_type_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "userId_idx" ON "account" ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "userId_idx" ON "session" ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "name_idx" ON "user" ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "name_idx" ON "game" ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "name_idx" ON "quality" ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "name_idx" ON "skin" ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "url_idx" ON "skin" ("url");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "name_idx" ON "skin_type" ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "name_idx" ON "source" ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "url_idx" ON "source" ("url");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "name_idx" ON "weapon" ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "name_idx" ON "weapon_type" ("name");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "game_source" ADD CONSTRAINT "game_source_game_id_game_id_fk" FOREIGN KEY ("game_id") REFERENCES "game"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "game_source" ADD CONSTRAINT "game_source_source_id_source_id_fk" FOREIGN KEY ("source_id") REFERENCES "source"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "skin" ADD CONSTRAINT "skin_type_id_skin_type_id_fk" FOREIGN KEY ("type_id") REFERENCES "skin_type"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "skin_quality" ADD CONSTRAINT "skin_quality_weapon_id_skin_id_fk" FOREIGN KEY ("weapon_id") REFERENCES "skin"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "skin_quality" ADD CONSTRAINT "skin_quality_quality_id_quality_id_fk" FOREIGN KEY ("quality_id") REFERENCES "quality"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "skin_quality_data" ADD CONSTRAINT "skin_quality_data_skin_quality_id_skin_quality_id_fk" FOREIGN KEY ("skin_quality_id") REFERENCES "skin_quality"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "source_weapon" ADD CONSTRAINT "source_weapon_weapon_id_weapon_id_fk" FOREIGN KEY ("weapon_id") REFERENCES "weapon"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "source_weapon" ADD CONSTRAINT "source_weapon_source_id_source_id_fk" FOREIGN KEY ("source_id") REFERENCES "source"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "weapon" ADD CONSTRAINT "weapon_type_id_weapon_type_id_fk" FOREIGN KEY ("type_id") REFERENCES "weapon_type"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "weapon_skin" ADD CONSTRAINT "weapon_skin_weapon_id_weapon_id_fk" FOREIGN KEY ("weapon_id") REFERENCES "weapon"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "weapon_skin" ADD CONSTRAINT "weapon_skin_skin_id_skin_id_fk" FOREIGN KEY ("skin_id") REFERENCES "skin"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
