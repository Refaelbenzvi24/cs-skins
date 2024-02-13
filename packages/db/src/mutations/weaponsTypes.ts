import { db, schema as schemaList } from "../index"
import type { InferInsert } from "../../types"


const tableName: keyof typeof schemaList = "weaponsTypes"

const getSchema = () => schemaList[tableName]

export type NewGame = InferInsert<ReturnType<typeof getSchema>>

export const insert = async ({ data }: { data: NewGame }) => {
	const schema   = getSchema()
	const [weaponType] = await
		db
		.insert(schema)
		.values(data)
		.returning()
		.execute()

	return weaponType!
}

export const insertMany = async (input: NewGame[]) => {
	const schema = getSchema()
	return await
		db
		.insert(schema)
		.values(input)
		.returning()
		.execute()
}
