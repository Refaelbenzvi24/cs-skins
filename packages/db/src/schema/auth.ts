import type { AdapterAccount } from "@auth/core/adapters";
import { relations, sql } from "drizzle-orm";
import {
	index,
	integer,
	primaryKey,
	text,
	timestamp,
	unique,
	jsonb
} from "drizzle-orm/pg-core";

import { pgTable } from "./_table";
import { createId } from "@paralleldrive/cuid2"


export interface Permissions {
}

export type PermissionsType = Permissions | { admin: boolean }

export const users = pgTable("user", {
	id:            text("id")
	               .$default(createId)
	               .primaryKey(),
	name:          text("name").notNull(),
	password:      text("password").notNull(),
	email:         text("email").notNull(),
	emailVerified: timestamp("email_verified", {
		mode:      "date",
		precision: 3,
	}).default(sql`CURRENT_TIMESTAMP(3)`),
	image:         text("image"),
	permissions:   jsonb("permissions")
	               .$type<PermissionsType>()
	               .default({ admin: false })
}, (user) => ({
	nameIdx: index("name_idx").on(user.name),
	nameUnq: unique().on(user.name)
}));

export const usersRelations = relations(users, ({ many }) => ({
	accounts: many(accounts),
}));

export const accounts = pgTable(
	"account",
	{
		userId:            text("userId").notNull(),
		type:              text("type")
		                   .$type<AdapterAccount["type"]>()
		                   .notNull(),
		provider:          text("provider").notNull(),
		providerAccountId: text("provider_account_id").notNull(),
		refresh_token:     text("refresh_token"),
		access_token:      text("access_token"),
		expires_at:        integer("expires_at"),
		token_type:        text("token_type"),
		scope:             text("scope"),
		id_token:          text("id_token"),
		session_state:     text("session_state"),
	},
	(account) => ({
		compoundKey: primaryKey({ columns: [account.provider, account.providerAccountId] }),
		userIdIdx:   index("userId_idx").on(account.userId),
	}),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
	user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = pgTable(
	"session",
	{
		sessionToken: text("session_token")
		              .notNull()
		              .primaryKey(),
		userId:       text("userId").notNull(),
		expires:      timestamp("expires", { mode: "date" }).notNull(),
	},
	(session) => ({
		userIdIdx: index("userId_idx").on(session.userId),
	}),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
	user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = pgTable(
	"verification_token",
	{
		identifier: text("identifier").notNull(),
		token:      text("token").notNull(),
		expires:    timestamp("expires", { mode: "date" }).notNull(),
	},
	(vt) => ({
		compoundKey: primaryKey({ columns: [vt.identifier, vt.token] })
	}),
);
