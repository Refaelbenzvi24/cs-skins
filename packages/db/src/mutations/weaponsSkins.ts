import { db, schema as schemaList } from "../index"
import type { DatabaseType, InferInsert } from "../../types"


const tableName: keyof typeof schemaList = "weaponsSkins"

const getSchema = () => schemaList[tableName]

export type NewWeaponSkin = InferInsert<ReturnType<typeof getSchema>>

export const insert = (data: NewWeaponSkin, dbInstance: DatabaseType = db) => {
	const schema = getSchema()

	return dbInstance
	.insert(schema)
	.values(data)
}
