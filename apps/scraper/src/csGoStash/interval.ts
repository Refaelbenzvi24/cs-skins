import { db, dbHelper, dbOperators, schema } from "@acme/db";
import { getSkinHtml, getSkinTableData } from "./shared";
import _ = require("lodash")


const getSkinsList = async (skinsUrls?: string[]) => {
	const { eq, and, inArray, sql } = dbOperators
	try {
		const queryResult = await
			db
				.select ()
				.from (schema.skins)
				.leftJoin (schema.weaponsSkins, eq (schema.skins.id, schema.weaponsSkins.skinId))
				.leftJoin (schema.weapons, eq (schema.weaponsSkins.weaponId, schema.weapons.id))
				.leftJoin (schema.sourcesWeapons, eq (schema.weapons.id, schema.sourcesWeapons.weaponId))
				.leftJoin (schema.sources, eq (schema.sourcesWeapons.sourceId, schema.sources.id))
				.where (({ source }) =>
					skinsUrls
						?
						and (
								eq (source.name, "CS Go Stash"),
							inArray (schema.skins.url, skinsUrls)
						)
						:
						eq (source.name, "CS Go Stash")
				)
				.execute ()

		return _ (queryResult)
			.uniqBy (({ skin }) => skin.id)
			.map (({ skin, source }) => ({
				...skin,
			}))
			.value ()
	} catch (error) {
		console.log (error)
		console.log ("error saving skin details to db")
	}
}

export const removePriceCharFromStr = (value: string) => {
	return value.replace (/₪|\$/g, "")
}

export const convertToNumber = (value: string) => {
	const number = Number (removePriceCharFromStr (value))
	return isNaN (number) || !isFinite (number) ? (number === 0 ? 0 : null) : number
}

const getSkinDetails = async (url: string) => {
	const { data: skinHtml } = await getSkinHtml (url) as { data: string }
	const skinsData = getSkinTableData (skinHtml)

	return skinsData.map (row => ({
		url,
		quality:          row[0] as string,
		steamPrice:       convertToNumber (row[1]),
		steamListings:    convertToNumber (row[2]),
		steamMedianPrice: convertToNumber (row[3]),
		steamVolume:      convertToNumber (row[4]),
		bitSkinsPrice:    convertToNumber (row[5])
	}))
}

const addSkinQualityIdsToSkinsData = async (skinsData: { [key: string]: any, skinId: string, quality: string }[]) => {
	const { inArray, and } = dbOperators
	const skinsDataQualitiesNames = _.map (skinsData, ({ quality }) => quality)
	const qualities = await
		db
			.select ({
				id:   schema.qualities.id,
				name: schema.qualities.name,
			})
			.from (schema.qualities)
			.where (({ name }) => inArray (name, skinsDataQualitiesNames))
			.execute ()
	const skinsQualitiesIdsMap = _.keyBy (qualities, ({ name }) => name)
	const skinsQualities = await
		db
			.select ({
				id:        schema.skinsQualities.id,
				qualityId: schema.skinsQualities.qualityId,
				skinId:    schema.skinsQualities.skinId,
			})
			.from (schema.skinsQualities)
			.where (({ qualityId, skinId }) => and (
				inArray (qualityId, _.map (skinsQualitiesIdsMap, ({ id }) => id)),
				inArray (skinId, _.map (skinsData, ({ skinId }) => skinId))
			))
			.execute ()
	return Promise.all (
		_.map (skinsData, async (skinData) => {
			const skinQuality = _.find (skinsQualities, ({ skinId, qualityId }) =>
				skinId === skinData.skinId && qualityId === skinsQualitiesIdsMap[skinData.quality].id
			)
			const skinQualityId = skinQuality?.id ??
				(await dbHelper.mutate.skinsQualities.insert ({
					data: {
						qualityId: skinsQualitiesIdsMap[skinData.quality].id,
						skinId:    skinData.skinId,
					}
				})).id

			return {
				...skinData,
				skinQualityId: skinQualityId,
			}
		})
	)
}

type SkinDetails = Awaited<ReturnType<typeof getSkinDetails>>[0]

const calculatePercentChange = (
	{ steamPrice, bitSkinsPrice, steamMedianPrice }:
		Pick<SkinDetails, "bitSkinsPrice" | "steamPrice" | "steamMedianPrice">
) => {
	const calculateSteamPrice = (steamPrice - steamMedianPrice) * 0.1 + steamMedianPrice
	const difference = calculateSteamPrice - bitSkinsPrice

	return convertToNumber (((difference / calculateSteamPrice) * 100).toFixed (2))
}

const saveSkinsDetailsToDb = async (skinsData: typeof schema.skinsQualitiesData.$inferInsert[]) => {
	return await
		db
			.insert (schema.skinsQualitiesData)
			.values (skinsData)
			.execute ()
}

export const scrapeCsGoStash = async (weapon?: { url: string }[]) => {
	const skinsList = await getSkinsList (weapon?.map (({ url }) => url))
	const withSkinData = _ (
		await Promise.all (
			_.map (skinsList, async (skin) =>
				_.map (await getSkinDetails (skin.url), skinData => ({
					...skinData,
					skinId:        skin.id,
					percentChange: calculatePercentChange (skinData)
				}))
			)
		)
	)
		.flatten ()
		.value ()
	const withSkinQualityId = await addSkinQualityIdsToSkinsData (withSkinData)
	await saveSkinsDetailsToDb (withSkinQualityId)
}
