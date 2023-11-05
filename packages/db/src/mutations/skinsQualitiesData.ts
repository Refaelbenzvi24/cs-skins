import { db, schema as schemaList } from "../../index"
import type { InferInsert } from "../../types"


const tableName: keyof typeof schemaList = 'skinsQualitiesData'

const getSchema = () => schemaList[tableName]

export type NewSkinQualityData = InferInsert<ReturnType<typeof getSchema>>

export const insert = async ({ data }: { data: NewSkinQualityData }) => {
	const schema        = getSchema()
	const [skinQualityData] = await
		db
		.insert(schema)
		.values(data)
		.returning()
		.execute()

	return skinQualityData!
}

export const insertMany = async (input: NewSkinQualityData[]) => {
	const schema = getSchema()
	return await
		db
		.insert(schema)
		.values(input)
		.returning()
		.execute()
}
