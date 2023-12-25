ALTER TABLE "skin_quality" RENAME COLUMN "weapon_id" TO "skin_id";--> statement-breakpoint
ALTER TABLE "skin_quality" DROP CONSTRAINT "skin_quality_weapon_id_quality_id_unique";--> statement-breakpoint
ALTER TABLE "skin_quality" DROP CONSTRAINT "skin_quality_weapon_id_skin_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "skin_quality" ADD CONSTRAINT "skin_quality_skin_id_skin_id_fk" FOREIGN KEY ("skin_id") REFERENCES "skin"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "skin_quality" ADD CONSTRAINT "skin_quality_skin_id_quality_id_unique" UNIQUE("skin_id","quality_id");