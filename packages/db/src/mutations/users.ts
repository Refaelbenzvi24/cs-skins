import { db, schema as schemaList } from "../index"
import type { DatabaseType, InferInsert } from "../../types"


const tableName: keyof typeof schemaList = 'users'

const getSchema = () => schemaList[tableName]

export type NewUser = InferInsert<ReturnType<typeof getSchema>>

export const insert = (data: NewUser, dbInstance: DatabaseType = db) => {
	const schema = getSchema()
	return dbInstance
	.insert(schema)
	.values(data)
}
