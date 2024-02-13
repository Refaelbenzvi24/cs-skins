import { db, schema as schemaList } from "../index"
import type { InferInsert } from "../../types"


const tableName: keyof typeof schemaList = 'qualities'

const getSchema = () => schemaList[tableName]

export type NewQuality = InferInsert<ReturnType<typeof getSchema>>

export const insert = async ({ data }: { data: NewQuality }) => {
	const schema = getSchema()
	const [quality] = await
		db
		.insert(schema)
		.values(data)
		.returning()
		.execute()

	return quality!
}

export const insertMany = async (input: NewQuality[]) => {
	const schema = getSchema()
	return await
		db
		.insert(schema)
		.values(input)
		.returning()
		.execute()
}
