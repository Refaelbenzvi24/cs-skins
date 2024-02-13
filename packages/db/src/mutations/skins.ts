import { db, schema as schemaList } from "../index"
import type { InferInsert } from "../../types"


const tableName: keyof typeof schemaList = "skins"

const getSchema = () => schemaList[tableName]

export type NewSkin = InferInsert<ReturnType<typeof getSchema>>

export const insert = async ({ data, connect }: { data: NewSkin, connect?: { weaponId?: string } }) => {
	const schema = getSchema()
	const [skin] = await
		db
		.insert(schema)
		.values(data)
		.returning()
		.execute()

	if(connect?.weaponId){
		await
			db
			.insert(schemaList.weaponsSkins)
			.values({ weaponId: connect.weaponId, skinId: skin!.id })
			.returning()
			.execute()
	}

	return skin!
}

export const insertMany = async (input: NewSkin[]) => {
	const schema = getSchema()
	return await
		db
		.insert(schema)
		.values(input)
		.returning()
		.execute()
}
