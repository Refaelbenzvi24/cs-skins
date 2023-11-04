import { index, unique, real, text, timestamp, integer } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2"

import { pgTable } from "./_table";


export const games = pgTable(
	"game",
	{
		id:        text("id").$default(createId).primaryKey(),
		name:      text("name").notNull(),
		createdAt: timestamp("created_at")
		           .default(sql`CURRENT_TIMESTAMP`)
		           .notNull(),
		updatedAt: timestamp("updated_at")
	}, (game) => ({
		nameIdx: index("name_idx").on(game.name),
		nameUnq: unique().on(game.name)
	})
)

export const gamesSources = pgTable(
	"game_source",
	{
		id:        text("id").$default(createId).primaryKey(),
		gameId:    text("game_id").references(() => games.id).notNull(),
		sourceId:  text("source_id").references(() => sources.id).notNull(),
		createdAt: timestamp("created_at")
		           .default(sql`CURRENT_TIMESTAMP`)
		           .notNull(),
	}, (gameSource) => ({
		unique1: unique().on(gameSource.gameId, gameSource.sourceId)
	})
)

export const sources = pgTable(
	"source",
	{
		id:        text("id").$default(createId).primaryKey(),
		name:      text("name").notNull(),
		url:       text("url").notNull(),
		createdAt: timestamp("created_at")
		           .default(sql`CURRENT_TIMESTAMP`)
		           .notNull(),
		updatedAt: timestamp("updated_at")
	},
	(source) => ({
		nameUnq: unique().on(source.name),
		nameIdx: index("name_idx").on(source.name),
		urlIdx:  index("url_idx").on(source.url),
		urlUnq:  unique().on(source.url),
	})
)

export const sourcesWeapons = pgTable(
	"source_weapon",
	{
		id:        text("id").$default(createId).primaryKey(),
		weaponId:  text("weapon_id").references(() => weapons.id).notNull(),
		sourceId:  text("source_id").references(() => sources.id).notNull(),
		createdAt: timestamp("created_at")
		           .default(sql`CURRENT_TIMESTAMP`)
		           .notNull(),
	},
	(sourceWeapon) => ({
		unique1: unique().on(sourceWeapon.sourceId, sourceWeapon.weaponId)
	})
)

export const weapons = pgTable(
	"weapon",
	{
		id:        text("id").$default(createId).primaryKey(),
		typeId:    text("type_id").references(() => weaponsTypes.id),
		name:      text("name").notNull(),
		createdAt: timestamp("created_at")
		           .default(sql`CURRENT_TIMESTAMP`)
		           .notNull(),
		updatedAt: timestamp("updated_at")
	},
	(weapon) => ({
		nameUnq: unique().on(weapon.name),
		nameIdx: index("name_idx").on(weapon.name),
	})
)

export const weaponsTypes = pgTable(
	"weapon_type",
	{
		id:        text("id").$default(createId).primaryKey(),
		name:      text("name").notNull(),
		createdAt: timestamp("created_at")
		           .default(sql`CURRENT_TIMESTAMP`)
		           .notNull(),
		updatedAt: timestamp("updated_at")
	}, (weaponType) => ({
		nameUnq: unique().on(weaponType.name),
		nameIdx: index("name_idx").on(weaponType.name),
	})
)

export const weaponsSkins = pgTable(
	"weapon_skin",
	{
		id:        text("id").$default(createId).primaryKey(),
		weaponId:  text("weapon_id").references(() => weapons.id).notNull(),
		skinId:    text("skin_id").references(() => skins.id).notNull(),
		createdAt: timestamp("created_at")
		           .default(sql`CURRENT_TIMESTAMP`)
		           .notNull(),
	}, (weaponSkin) => ({
		unique1: unique().on(weaponSkin.weaponId, weaponSkin.skinId)
	})
)

export const skins = pgTable(
	"skin",
	{
		id:        text("id").$default(createId).primaryKey(),
		typeId:    text("type_id").references(() => skinsTypes.id),
		name:      text("name").notNull(),
		url:       text("url").notNull(),
		createdAt: timestamp("created_at")
		           .default(sql`CURRENT_TIMESTAMP`)
		           .notNull(),
		updatedAt: timestamp("updated_at")
	},
	(skin) => ({
		nameIdx: index("name_idx").on(skin.name),
		nameUnq: unique().on(skin.name),
		urlIdx:  index("url_idx").on(skin.url),
		urlUnq:  unique().on(skin.url),
	})
)

export const skinsTypes = pgTable(
	"skin_type",
	{
		id:        text("id").$default(createId).primaryKey(),
		name:      text("name").notNull(),
		createdAt: timestamp("created_at")
		           .default(sql`CURRENT_TIMESTAMP`)
		           .notNull(),
		updatedAt: timestamp("updated_at")
	}, (skinType) => ({
		nameUnq: unique().on(skinType.name),
		nameIdx: index("name_idx").on(skinType.name),
	})
)

export const skinsQualities = pgTable(
	"skin_quality",
	{
		id:        text("id").$default(createId).primaryKey(),
		skinId:    text("weapon_id").references(() => skins.id).notNull(),
		qualityId: text("quality_id").references(() => qualities.id).notNull(),
		createdAt: timestamp("created_at")
		           .default(sql`CURRENT_TIMESTAMP`)
		           .notNull(),
		updatedAt: timestamp("updated_at")
	},
	(skinQuality) => ({
		unique1: unique().on(skinQuality.skinId, skinQuality.qualityId)
	})
);

export const skinsQualitiesData = pgTable(
	"skin_quality_data",
	{
		id:               text("id").$default(createId).primaryKey(),
		skinQualityId:    text("skin_quality_id").references(() => skinsQualities.id).notNull(),
		steamPrice:       real("steam_price"),
		steamListings:    integer("steam_listings"),
		steamVolume:      integer("steam_volume"),
		steamMedianPrice: real("steam_median_price"),
		bitSkinsPrice:    real("bitskinsprice"),
		percentChange:    real("percent_change"),
		createdAt:        timestamp("created_at")
		                  .default(sql`CURRENT_TIMESTAMP`)
		                  .notNull()
	}, (skinQualityData) => ({
		unique1: unique().on(skinQualityData.skinQualityId, skinQualityData.createdAt)
	})
)

export const qualities = pgTable(
	"quality",
	{
		id:        text("id").$default(createId).primaryKey(),
		name:      text("name").notNull(),
		createdAt: timestamp("created_at")
		           .default(sql`CURRENT_TIMESTAMP`)
		           .notNull(),
		updatedAt: timestamp("updated_at")
	}, (skinsQuality) => ({
		nameIdx: index("name_idx").on(skinsQuality.name),
		nameUnq: unique().on(skinsQuality.name)
	})
)
