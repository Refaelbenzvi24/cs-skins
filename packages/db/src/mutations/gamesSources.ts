import { db, schema as schemaList } from "../index"
import type { DatabaseType, InferInsert } from "../../types"


const tableName: keyof typeof schemaList = 'gamesSources'

const getSchema = () => schemaList[tableName]

export type NewGameSource = InferInsert<ReturnType<typeof getSchema>>

export const insert = (data: NewGameSource, dbInstance: DatabaseType = db) => {
	const schema = getSchema()
	return dbInstance
	.insert(schema)
	.values(data)
}
