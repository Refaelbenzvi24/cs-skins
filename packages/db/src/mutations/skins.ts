import { db, schema as schemaList } from "../index"
import type { DatabaseType, InferInsert } from "../../types"


const tableName: keyof typeof schemaList = "skins"

const getSchema = () => schemaList[tableName]

export type NewSkin = InferInsert<ReturnType<typeof getSchema>>

export const insert = (data: NewSkin, dbInstance: DatabaseType = db) => {
	const schema = getSchema()
	return dbInstance
	.insert(schema)
	.values(data)
}
