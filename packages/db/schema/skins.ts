import { index, unique, real, text, timestamp, int, varchar } from "drizzle-orm/mysql-core";
import { relations, sql } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2"

import { mySqlTable } from "./_table";


export const skins = mySqlTable (
	"skin",
	{
		id:        varchar ("id", { length: 255 }).$default (createId).primaryKey (),
		weaponId:  varchar ("weapon_id", { length: 255 }),
		qualityId: varchar ("quality_id", { length: 255 }),
		createdAt: timestamp ("created_at")
			           .default (sql`CURRENT_TIMESTAMP`)
			           .notNull (),
		updatedAt: timestamp ("updated_at")
	},
	(skin) => ({
		unique1: unique ().on (skin.weaponId, skin.qualityId)
	})
);

export const skinsRelations = relations (skins, ({ one, many }) => ({
	skinsData: many (skinsData),
	quality:   one (skinsQuality, { fields: [skins.qualityId], references: [skinsQuality.id] }),
	weapon:    one (weapons, { fields: [skins.weaponId], references: [weapons.id] })
}));

export const skinsData = mySqlTable (
	"skinData",
	{
		id:               varchar ("id", { length: 255 }).$default (createId).primaryKey (),
		skinId:           varchar ("skin_id", { length: 255 }),
		steamPrice:       real ("steam_price"),
		steamListings:    int ("steam_listings"),
		steamVolume:      int ("steam_volume"),
		steamMedianPrice: real ("steam_median_price"),
		bitSkinsPrice:    real ("bitskinsprice"),
		percentChange:    real ("percent_change"),
		createdAt:        timestamp ("created_at")
			                  .default (sql`CURRENT_TIMESTAMP`)
			                  .notNull ()
	},
	(skinData) => ({
		unique1: unique ().on (skinData.skinId, skinData.createdAt)
	})
)

export const skinsDataRelations = relations (skinsData, ({ one }) => ({
	skin: one (skins, { fields: [skinsData.skinId], references: [skins.id] })
}))

export const weapons = mySqlTable (
	"weapon",
	{
		id:        varchar ("id", { length: 255 }).$default (createId).primaryKey (),
		sourceId:  varchar ("source_id", { length: 255 }),
		name:      varchar ("name", { length: 255 }).notNull (),
		url:       varchar ("url", { length: 2083 }).notNull (),
		createdAt: timestamp ("created_at")
			           .default (sql`CURRENT_TIMESTAMP`)
			           .notNull (),
		updatedAt: timestamp ("updated_at")
	},
	(weapon) => ({
		nameIdx: index ("name_idx").on (weapon.name),
		nameUnq: unique ().on (weapon.name)
	})
)

export const weaponsRelations = relations (weapons, ({ one, many }) => ({
	skins:  many (skins),
	source: one (sources, { fields: [weapons.sourceId], references: [sources.id] })
}))

export const sources = mySqlTable (
	"source",
	{
		id:        varchar ("id", { length: 255 }).$default (createId).primaryKey (),
		name:      varchar ("name", { length: 255 }).notNull (),
		url:       varchar ("url", { length: 2083 }).notNull (),
		createdAt: timestamp ("created_at")
			           .default (sql`CURRENT_TIMESTAMP`)
			           .notNull (),
		updatedAt: timestamp ("updated_at")
	},
	(source) => ({
		nameUnq: unique ().on (source.name),
		nameIdx: index ("name_idx").on (source.name),
	})
)

export const sourceRelations = relations (sources, ({ many }) => ({
	weapons: many (weapons)
}))

export const skinsQuality = mySqlTable (
	"skinsQuality",
	{
		id:        varchar ("id", { length: 255 }).$default (createId).primaryKey (),
		name:      varchar ("name", { length: 255 }).notNull (),
		createdAt: timestamp ("created_at")
			           .default (sql`CURRENT_TIMESTAMP`)
			           .notNull (),
		updatedAt: timestamp ("updated_at")
	}, (skinsQuality) => ({
		nameIdx: index ("name_idx").on (skinsQuality.name),
		nameUnq: unique ().on (skinsQuality.name)
	}))

export const skinsQualityRelations = relations (skinsQuality, ({ many }) => ({
	skins: many (skins)
}))

