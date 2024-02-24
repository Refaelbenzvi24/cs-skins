import { db, schema as schemaList } from "../index"
import type { DatabaseType, InferInsert } from "../../types"


const tableName: keyof typeof schemaList = 'sources'

const getSchema = () => schemaList[tableName]

export type NewSource = InferInsert<ReturnType<typeof getSchema>>

export const insert = (data: NewSource, dbInstance: DatabaseType = db) => {
	const schema = getSchema()
	return dbInstance
	.insert(schema)
	.values(data)
}
