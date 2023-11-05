import { sql } from "drizzle-orm";
import { timestamp, text } from "drizzle-orm/pg-core";

import { pgTable } from "./_table";
import { createId } from "@paralleldrive/cuid2"

export const post = pgTable("post", {
	id: text("id").$default(createId).primaryKey(),
	title: text("name").notNull(),
	content: text("content").notNull(),
	createdAt: timestamp("created_at")
		    .default(sql`CURRENT_TIMESTAMP`)
		    .notNull(),
	updatedAt: timestamp("updatedAt")
});
