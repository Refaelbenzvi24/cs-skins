import { getSkinHtml, getSkinTableData, getSkinTitle } from "./shared"
import { db, schema, dbOperators, dbHelper } from "@acme/db"
import { newError } from "../services/logger"


const getBasicSkinData = async (url: string) => {
	const { data: skinHtml } = await getSkinHtml(url)

	const skinsData                = getSkinTableData(skinHtml)
	const { weaponName, skinName } = getSkinTitle(skinHtml)

	return {
		skins: skinsData.map(row => ({
			quality: row[0] as string,
		})),
		weaponName,
		skinName,
	}
}

const connectSkinQuality = async ({ quality, skinId }: { skinId: string, quality: string }) => {
	const { eq }      = dbOperators
	const skinQuality = await
		db
		.select({
			id:   schema.qualities.id,
			name: schema.qualities.name,
		})
		.from(schema.qualities)
		.where(({ name }) => eq(name, quality))
		.execute()

	return await
		db
		.insert(schema.skinsQualities)
		.values({
			qualityId: skinQuality[0].id,
			skinId:    skinId,
		})
		.returning()
		.execute()
}

const getSource = async () => {
	const { eq }   = dbOperators
	const [source] = await
		db
		.select({
			id:   schema.sources.id,
			name: schema.sources.name,
		})
		.from(schema.sources)
		.where(({ name }) => eq(name, "CS Go Stash"))
		.execute()

	if (!source) throw newError.BaseError("errors:sources.notFound", { extraDetails: { sourceName: "CS Go Stash" } })
	return source
}

const getWeapon = ({ data }: { data: Parameters<typeof dbHelper.mutate.weapons.insert>[0]['data'] }) => {
	const weaponQuery =
		      db
		      .select()
		      .from(schema.weapons)
		      .where(({ name: weaponName }) => dbOperators.eq(weaponName, data.name))

	return {
		ignoreIfNotExists: async () => await weaponQuery.execute(),
		insertIfNotExists: async ({ connect = {} }: { connect?: Parameters<typeof dbHelper.mutate.weapons.insert>[0]['connect'] } = {}) => {
			const [weapon] = await weaponQuery.execute()

			if(weapon) return weapon
			return await dbHelper.mutate.weapons.insert({ data, connect })
		}
	}
}

const insertSkin = async ({ name, url }: typeof schema.skins.$inferInsert) => {
	const [skin] = await
		db
		.insert(schema.skins)
		.values({
			name,
			url,
		})
		.returning()
		.onConflictDoNothing()
		.execute()
	return skin!
}

export const initialScrapeCsGoStash = async (url: string) => {
	const { skins, weaponName, skinName } = await getBasicSkinData(url)
	const source = await getSource()
	const weapon = await getWeapon({ data: { name: weaponName } })
	.insertIfNotExists({ connect: { sourceId: source.id } })
	const newSkin = await dbHelper.mutate.skins.insert({ data: { name: skinName, url }, connect: { weaponId: weapon.id } })
	await Promise.all(skins.map(async skin => await connectSkinQuality({ quality: skin.quality, skinId: newSkin.id })))
}
