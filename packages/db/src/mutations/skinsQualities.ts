import { db, schema as schemaList } from "../index"
import type { InferInsert } from "../../types"

const tableName: keyof typeof schemaList = 'skinsQualities'

const getSchema = () => schemaList[tableName]

export type NewSkinQuality = InferInsert<ReturnType<typeof getSchema>>

export const insert = async ({ data }: { data: NewSkinQuality }) => {
	const schema        = getSchema()
	const [skinQuality] = await
		db
		.insert(schema)
		.values(data)
		.returning()
		.execute()

	return skinQuality!
}

export const insertMany = async (input: NewSkinQuality[]) => {
	const schema = getSchema()
	return await
		db
		.insert(schema)
		.values(input)
		.returning()
		.execute()
}
