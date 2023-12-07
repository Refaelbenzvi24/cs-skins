import { db, dbOperators, schema, schema as schemaList } from "../../index"
import { addOperatorByParametersNil } from "../helpers"
import type { PaginateWithSearchAndDateRangeParams, PaginateWithSearchParams } from "../../types/queryParams"


const tableName: keyof typeof schemaList = "skinsQualitiesData"

const getSchema = () => schemaList[tableName]

const list = ({ limit, search, cursor }: PaginateWithSearchParams) => {
	const { skins, weaponsSkins, weapons, skinsQualitiesData, qualities, skinsQualities } = schema
	const { eq, gte, gt, desc, like, or, and }                                            = dbOperators
	const time10MinutesAgo                                                                = new Date(Date.now() - 10 * 60 * 1000)
	return db
	.select({
		weaponName:                      weapons.name,
		skinName:                        skins.name,
		skinQualityDataCreatedAt:        skinsQualitiesData.createdAt,
		skinQualityDataSteamVolume:      skinsQualitiesData.steamVolume,
		skinQualityDataSteamListings:    skinsQualitiesData.steamListings,
		skinQualityDataPercentChange:    skinsQualitiesData.percentChange,
		skinQualityDataSteamPrice:       skinsQualitiesData.steamPrice,
		skinQualityDataSteamMedianPrice: skinsQualitiesData.steamMedianPrice,
		skinQualityDataBitSkinsPrice:    skinsQualitiesData.bitSkinsPrice,
		skinId:                          skins.id,
		skinUrl:                         skins.url,
		skinQualityId:                   skinsQualities.id,
		qualityId:                       qualities.id,
		qualityName:                     qualities.name,
	})
	.from(skins)
	.leftJoin(weaponsSkins, eq(weaponsSkins.skinId, skins.id))
	.leftJoin(weapons, eq(weapons.id, weaponsSkins.weaponId))
	.leftJoin(skinsQualities, eq(skinsQualities.skinId, skins.id))
	.leftJoin(skinsQualitiesData, eq(skinsQualitiesData.skinQualityId, skinsQualities.id))
	.leftJoin(qualities, eq(qualities.id, skinsQualities.qualityId))
	.orderBy(({ skinId }) => desc(skinId))
	.where((queryData) => and(
		gte(queryData.skinQualityDataCreatedAt, time10MinutesAgo),
		gt(queryData.skinQualityDataSteamVolume, 0),
		gte(queryData.skinQualityDataSteamListings, 5),
		gte(queryData.skinQualityDataPercentChange, 20),
		addOperatorByParametersNil({ cursor }, ({ cursor }) => gt(queryData.skinId, cursor)),
		addOperatorByParametersNil({ search }, ({ search }) => or(
			like(queryData.skinName, `${search}`),
			like(queryData.weaponName, `${search}`),
			like(queryData.qualityName, `${search}`)
		))
	))
	.limit(limit ?? 20)
}

const getBySkinIdWithData = ({ limit, skinId, search, dateRange, cursor }: PaginateWithSearchAndDateRangeParams & {
	skinId: string,
}) => {
	const schema                                                                          = getSchema()
	const { skins, weaponsSkins, weapons, skinsQualitiesData, skinsQualities, qualities } = schemaList
	const { eq, gt, gte, avg, avgDistinct, desc, like, and, lte, sql }                    = dbOperators
	return db.select({
		         id:         skinsQualitiesData.id,
		         skinId:     skins.id,
		         weaponName: weapons.name,
		         skinName:   skins.name,
		         quality:    qualities.name,
		         // avgPrice:          avg(skinsQualitiesData.bitSkinsPrice),
		         // avgListing:        avg(skinsQualitiesData.steamListings),
		         // avgListing2:       sql<string>`AVG(${skinsQualitiesData.steamMedianPrice}) OVER (PARTITION BY EXTRACT('hour' FROM ${skinsQualitiesData.createdAt}), EXTRACT('day' FROM ${skinsQualitiesData.createdAt}))`,
		         bitSkinsPrice:     skinsQualitiesData.bitSkinsPrice,
		         percentChange:     skinsQualitiesData.percentChange,
		         steamListings:     skinsQualitiesData.steamListings,
		         steamMedianPrice:  skinsQualitiesData.steamMedianPrice,
		         steamVolume:       skinsQualitiesData.steamVolume,
		         steamPrice:        skinsQualitiesData.steamPrice,
		         createdAt:         skins.createdAt,
		         skinDataCreatedAt: skinsQualitiesData.createdAt,
	         })
	         .from(schema)
	         .leftJoin(skinsQualities, eq(skinsQualities.id, skinsQualitiesData.skinQualityId))
	         .leftJoin(skins, eq(skins.id, skinsQualities.skinId))
	         .leftJoin(qualities, eq(qualities.id, skinsQualities.qualityId))
	         .leftJoin(weaponsSkins, eq(weaponsSkins.skinId, skins.id))
	         .leftJoin(weapons, eq(weapons.id, weaponsSkins.weaponId))
	         .where((queryData) => and(
		         addOperatorByParametersNil({ cursor }, ({ cursor }) => gt(queryData.id, cursor)),
		         eq(queryData.skinId, skinId),
		         addOperatorByParametersNil({ search }, ({ search }) => like(queryData.quality, `${search}`)),
		         addOperatorByParametersNil({ start: dateRange?.start, end: dateRange?.end }, ({ start, end }) => and(
			         gte(queryData.skinDataCreatedAt, start),
			         lte(queryData.skinDataCreatedAt, end)
		         ))
	         ))
	         .orderBy(({ skinDataCreatedAt }) => desc(skinDataCreatedAt))
	         .groupBy(skins.id, skinsQualitiesData.id, weapons.name, skins.name, qualities.name, skinsQualitiesData.bitSkinsPrice, skinsQualitiesData.percentChange, skinsQualitiesData.steamListings, skinsQualitiesData.steamMedianPrice, skinsQualitiesData.steamVolume, skinsQualitiesData.steamPrice, skins.createdAt, skinsQualitiesData.createdAt)
	         .limit(limit ?? 20)
}

export default { list, getBySkinIdWithData }
