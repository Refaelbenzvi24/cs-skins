import { db, dbOperators, schema, schema as schemaList } from "../index"
import { addOperatorByParametersNil } from "../utils"
import type {
	PaginateWithSearchAndDateRangeParams, PaginateWithSearchParams, WithLimitParam, WithIdParam, WithDateRangeParam
} from "../../types/queryParams"
import { addAsToSelectKeys } from "../utils/helpers"
import whereClauses from "../utils/whereClauses"


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
	const { eq, gt, gte, desc, like, and, lte }                                           = dbOperators
	return db.select({
		         id:                skinsQualitiesData.id,
		         skinId:            skins.id,
		         weaponName:        weapons.name,
		         skinName:          skins.name,
		         quality:           qualities.name,
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
		         eq(queryData.skinId, skinId),
		         addOperatorByParametersNil({ cursor }, ({ cursor }) => gt(queryData.id, cursor)),
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

const skinsDataAggregationPartitionedByDays = ({ skinId, dateRange }: WithIdParam<"skinId"> & WithDateRangeParam) => {
	const schema                                                                          = getSchema()
	const { skins, weaponsSkins, weapons, skinsQualitiesData, skinsQualities, qualities } = schemaList
	const { eq, desc, sql, rowNumber, over, avgPartitionedOverTimeStamp, and }            = dbOperators
	const { dateRange: whereDateRange }                                                   = whereClauses
	return db
	.select({
		id:        schema.id,
		quality:   qualities.name,
		createdAt: skinsQualitiesData.createdAt,
		...addAsToSelectKeys({
			steamPriceAvg:       avgPartitionedOverTimeStamp(skinsQualitiesData.steamPrice, skinsQualitiesData.createdAt),
			steamListingsAvg:    avgPartitionedOverTimeStamp(skinsQualitiesData.steamListings, skinsQualitiesData.createdAt),
			steamVolumeAvg:      avgPartitionedOverTimeStamp(skinsQualitiesData.steamVolume, skinsQualitiesData.createdAt),
			steamMedianPriceAvg: avgPartitionedOverTimeStamp(skinsQualitiesData.steamMedianPrice, skinsQualitiesData.createdAt),
			bitSkinPriceAvg:     avgPartitionedOverTimeStamp(skinsQualitiesData.bitSkinsPrice, skinsQualitiesData.createdAt),
			percentChangeAvg:    avgPartitionedOverTimeStamp(skinsQualitiesData.percentChange, skinsQualitiesData.createdAt),
			rowNumber:           rowNumber(undefined, over(sql`ORDER BY
			${skinsQualitiesData.createdAt}`)),
			totalCount:          sql`count(*) OVER ()`.mapWith(Number)
		})
	})
	.from(schema)
	.leftJoin(skinsQualities, eq(skinsQualities.id, skinsQualitiesData.skinQualityId))
	.leftJoin(skins, eq(skins.id, skinsQualities.skinId))
	.leftJoin(qualities, eq(qualities.id, skinsQualities.qualityId))
	.leftJoin(weaponsSkins, eq(weaponsSkins.skinId, skins.id))
	.leftJoin(weapons, eq(weapons.id, weaponsSkins.weaponId))
	.where(and(
		eq(skins.id, skinId),
		addOperatorByParametersNil({ start: dateRange?.start, end: dateRange?.end }, ({ start, end }) =>
			whereDateRange(skinsQualitiesData.createdAt, { start, end })
		)
	))
	.orderBy(({ createdAt }) => desc(createdAt))
}

const getBySkinIdWithDataForChart = ({ limit, skinId, dateRange }: WithLimitParam & WithDateRangeParam & WithIdParam<"skinId">) => {
	// const { withEquallyDistributedByRowNumber, withDateRange } = dynamicQueries
	const { and }                           = dbOperators
	const { equallyDistributedByRowNumber } = whereClauses

	const skinsDataAggregatedPartitionedByDays = db
	.$with("skinsDataAggregatedPartitionedByDays")
	.as(skinsDataAggregationPartitionedByDays({ skinId, dateRange }))

	return db
	.with(skinsDataAggregatedPartitionedByDays)
	.select()
	.from(skinsDataAggregatedPartitionedByDays)
	.where(({ rowNumber, totalCount }) => and(
		equallyDistributedByRowNumber(rowNumber, totalCount, { limit })
	))
}

export default { list, getBySkinIdWithData, getBySkinIdWithDataForChart }
