import { db, schema as schemaList } from "../index"
import type { DatabaseType, InferInsert } from "../../types"


const tableName: keyof typeof schemaList = "weapons"

const getSchema = () => schemaList[tableName]

export type NewWeapon = InferInsert<ReturnType<typeof getSchema>>

export const insert = (data: NewWeapon, dbInstance: DatabaseType = db) => {
	const schema = getSchema()

	return dbInstance
	.insert(schema)
	.values(data)
}
