import { db, schema as schemaList } from "../../index"
import type { InferInsert } from "../../types"


const tableName: keyof typeof schemaList = "weapons"

const getSchema = () => schemaList[tableName]

export type NewWeapon = InferInsert<ReturnType<typeof getSchema>>

export const insert = async ({ data, connect }: { data: NewWeapon, connect?: { skinId?: string, sourceId?: string } }) => {
	const schema   = getSchema()

	const [weapon] = await
		db
		.insert(schema)
		.values(data)
		.returning()
		.execute()

	if (connect?.skinId)
		await
			db
			.insert(schemaList.weaponsSkins)
			.values({ weaponId: weapon!.id, skinId: connect.skinId })
			.returning()
			.execute()

	if (connect?.sourceId)
		await
			db
			.insert(schemaList.sourcesWeapons)
			.values({ weaponId: weapon!.id, sourceId: connect.sourceId })
			.returning()
			.execute()

	return weapon!
}

export const insertMany = async (input: NewWeapon[]) => {
	const schema = getSchema()
	return await
		db
		.insert(schema)
		.values(input)
		.returning()
		.execute()
}
