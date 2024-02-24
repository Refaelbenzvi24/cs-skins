import { db, schema as schemaList } from "../index"
import type { DatabaseType, InferInsert } from "../../types"


const tableName: keyof typeof schemaList = 'qualities'

const getSchema = () => schemaList[tableName]

export type NewQuality = InferInsert<ReturnType<typeof getSchema>>

export const insert = (data: NewQuality, dbInstance: DatabaseType = db) => {
	const schema = getSchema()
	return dbInstance
	.insert(schema)
	.values(data)
}
