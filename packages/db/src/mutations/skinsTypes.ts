import { db, schema as schemaList } from "../index"
import type { InferInsert } from "../../types"


const tableName: keyof typeof schemaList = "skinsTypes"

const getSchema = () => schemaList[tableName]

export type NewSkinType = InferInsert<ReturnType<typeof getSchema>>

export const insert = async ({ data }: { data: NewSkinType }) => {
	const schema   = getSchema()
	const [skinType] = await
		db
		.insert(schema)
		.values(data)
		.returning()
		.execute()

	return skinType!
}

export const insertMany = async (input: NewSkinType[]) => {
	const schema = getSchema()
	return await
		db
		.insert(schema)
		.values(input)
		.returning()
		.execute()
}
