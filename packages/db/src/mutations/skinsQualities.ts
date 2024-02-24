import { db, schema as schemaList } from "../index"
import type { DatabaseType, InferInsert } from "../../types"


const tableName: keyof typeof schemaList = 'skinsQualities'

const getSchema = () => schemaList[tableName]

export type NewSkinQuality = InferInsert<ReturnType<typeof getSchema>>

export const insert = (data: NewSkinQuality, dbInstance: DatabaseType = db) => {
	const schema = getSchema()
	return dbInstance
	.insert(schema)
	.values(data)
}
