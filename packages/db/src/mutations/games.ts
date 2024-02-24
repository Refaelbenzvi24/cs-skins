import { db, schema as schemaList } from "../index"
import type { DatabaseType, InferInsert } from "../../types"


const tableName: keyof typeof schemaList = 'games'

const getSchema = () => schemaList[tableName]

export type NewGame = InferInsert<ReturnType<typeof getSchema>>

export const insert = (data: NewGame, dbInstance: DatabaseType = db) => {
	const schema = getSchema()
	return dbInstance
	.insert(schema)
	.values(data)
}
