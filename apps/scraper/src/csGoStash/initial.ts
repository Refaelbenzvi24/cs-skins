import { getSkinHtml, getSkinTableData, getSkinTitle } from "./shared"
import { db, schema, dbHelper } from "@acme/db"
import { newError } from "../services/logger"


const getBasicSkinData = async (url: string) => {
	const { data: skinHtml } = await getSkinHtml(url)
	if(!skinHtml) throw newError.BaseError("errors:csGoStash.skin.notFound", { extraDetails: { url } })

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
	await db.transaction(async (tx) => {
		const [skinQuality] = await dbHelper
		.mutate
		.qualities
		.insert({ name: quality })
		.returning({ id: schema.qualities.id })
		.onConflictDoUpdate({
			target: schema.qualities.name,
			set:    { name: quality },
		})
		.execute()

		await db
		.insert(schema.skinsQualities)
		.values({
			qualityId: skinQuality!.id,
			skinId:    skinId,
		})
		.onConflictDoNothing()
		.execute()
	})
}

export const initialScrapeCsGoStash = async (url: string) => {
	const { skins, weaponName, skinName } = await getBasicSkinData(url)
	const newSkin                         = await db.transaction(async (tx) => {
		const [newSkin]        = await dbHelper
		.mutate
		.skins
		.insert({ name: skinName, url }, tx)
		.returning({ id: schema.skins.id })
		.onConflictDoUpdate({
			target: schema.skins.name,
			set:    { name: skinName, url },
		})
		.execute()
		const [insertedWeapon] = await dbHelper
		.mutate
		.weapons
		.insert({ name: skinName }, tx)
		.returning({ id: schema.weapons.id })
		.onConflictDoUpdate({
			target: schema.weapons.name,
			set:    { name: weaponName },
		})
		.execute()
		await dbHelper
		.mutate
		.weaponsSkins
		.insert({ weaponId: insertedWeapon!.id, skinId: newSkin!.id })
		.onConflictDoUpdate({
			target: [schema.weaponsSkins.weaponId, schema.weaponsSkins.skinId],
			set:    { weaponId: insertedWeapon!.id, skinId: newSkin!.id },
		})
		.execute()
		return newSkin!
	})
	await Promise.all(skins.map(async skin => await connectSkinQuality({ quality: skin.quality, skinId: newSkin.id })))
}
