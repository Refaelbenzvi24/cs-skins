import { db, dbHelper, dbOperators, schema } from "@acme/db";
import { getSkinHtml, getSkinTableData } from "./shared";
import _ from "lodash"
import { newError } from "../services/logger"


const getSkinsList = async (skinsUrls?: string[]) => {
	const { eq, and, inArray, sql } = dbOperators
	const queryResult               = await
		db
		.select()
		.from(schema.skins)
		.leftJoin(schema.weaponsSkins, eq(schema.skins.id, schema.weaponsSkins.skinId))
		.leftJoin(schema.weapons, eq(schema.weaponsSkins.weaponId, schema.weapons.id))
		.leftJoin(schema.sourcesWeapons, eq(schema.weapons.id, schema.sourcesWeapons.weaponId))
		.leftJoin(schema.sources, eq(schema.sourcesWeapons.sourceId, schema.sources.id))
		.where(({ source }) =>
			skinsUrls
				?
				// TODO: replace somehow with a constants parameters ("CS Go Stash")
				and(
					eq(source.name, "CS Go Stash"),
					inArray(schema.skins.url, skinsUrls)
				)
				:
				eq(source.name, "CS Go Stash")
		)
		.execute()

	const transformedQueryResult = _(queryResult)
	.uniqBy(({ skin }) => skin.id)
	.map(({ skin, source }) => ({
		...skin,
	}))
	.value()

	if(transformedQueryResult.length === 0) throw newError.BaseError("errors:skins.notFound", { extraDetails: { skinsUrls } })

	return transformedQueryResult
}

export const removePriceCharFromStr = (value: string) => {
	return value.replace(/₪|\$/g, "")
}

export const convertToNumber = (value: string) => {
	const number = Number(removePriceCharFromStr(value))
	return isNaN(number) || !isFinite(number) ? (number === 0 ? 0 : null) : number
}

const getSkinDetails = async (url: string) => {
	const { data: skinHtml } = await getSkinHtml(url) as { data: string }
	const skinsData          = getSkinTableData(skinHtml)

	return skinsData.map(row => ({
		url,
		quality:          row[0] as string,
		steamPrice:       convertToNumber(`${row[1]}`),
		steamListings:    convertToNumber(`${row[2]}`),
		steamMedianPrice: convertToNumber(`${row[3]}`),
		steamVolume:      convertToNumber(`${row[4]}`),
		bitSkinsPrice:    convertToNumber(`${row[5]}`)
	}))
}

type SkinDetails = Awaited<ReturnType<typeof getSkinDetails>>[0]

const calculatePercentChange = (
	{ steamPrice, bitSkinsPrice, steamMedianPrice }:
		Pick<SkinDetails, "bitSkinsPrice" | "steamPrice" | "steamMedianPrice">
) => {
	if(!steamPrice || !bitSkinsPrice || !steamMedianPrice) return null
	const calculateSteamPrice = (steamPrice - steamMedianPrice) * 0.1 + steamMedianPrice
	const difference          = calculateSteamPrice - bitSkinsPrice

	return convertToNumber(((difference / calculateSteamPrice) * 100).toFixed(2))
}

export const scrapeCsGoStash = async (weapon?: { url: string }[]) => {
	const skinsList = await getSkinsList(weapon?.map(({ url }) => url))
	await Promise.all(
		skinsList.map(async (skin) => {
			const skinDetails = await getSkinDetails(skin.url)
			const skinData    = skinDetails.map(skinData => ({
				...skinData,
				skinId:        skin.id,
				percentChange: calculatePercentChange(skinData)
			}))
			await Promise.all(skinData.map(async (skinData) => {
				await db.transaction(async (tx) => {
					const [quality]     = await dbHelper
					.mutate
					.qualities
					.insert({ name: skinData.quality }, tx)
					.onConflictDoUpdate({
						target: schema.qualities.name,
						set:    { name: skinData.quality },
					})
					.returning({ id: schema.qualities.id })
					.execute()
					const [skinQuality] = await dbHelper
					.mutate
					.skinsQualities
					.insert({ qualityId: quality!.id, skinId: skinData.skinId }, tx)
					.returning({ id: schema.skinsQualities.id })
					.onConflictDoUpdate({
						target: [schema.skinsQualities.qualityId, schema.skinsQualities.skinId],
						set:    { qualityId: quality!.id, skinId: skinData.skinId },
					})
					.execute()
					return await dbHelper
					.mutate
					.skinsQualitiesData
					.insert({ ..._.omit(skinData, ["quality", "skinId"]), skinQualityId: skinQuality!.id, }, tx)
					.returning({ id: schema.skinsQualitiesData.id, })
					.execute()
				})
			}))
		})
	)
}
