׳ALTER TABLE "account" DROP CONSTRAINT "account_provider_provider_account_id";--> statement-breakpoint
ALTER TABLE "verification_token" DROP CONSTRAINT "verification_token_identifier_token";--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id");--> statement-breakpoint
ALTER TABLE "verification_token" ADD CONSTRAINT "verification_token_identifier_token_pk" PRIMARY KEY("identifier","token");
