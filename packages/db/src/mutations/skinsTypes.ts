import { db, schema as schemaList } from "../index"
import type { DatabaseType, InferInsert } from "../../types"


const tableName: keyof typeof schemaList = "skinsTypes"

const getSchema = () => schemaList[tableName]

export type NewSkinType = InferInsert<ReturnType<typeof getSchema>>

export const insert = (data: NewSkinType, dbInstance: DatabaseType = db) => {
	const schema   = getSchema()
	return dbInstance
		.insert(schema)
		.values(data)
}
