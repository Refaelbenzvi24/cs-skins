import { db, schema as schemaList } from "../index"
import type { DatabaseType, InferInsert } from "../../types"
import _ from "lodash"


const tableName: keyof typeof schemaList = 'skinsQualitiesData'

const getSchema = () => schemaList[tableName]

export type NewSkinQualityData = InferInsert<ReturnType<typeof getSchema>>

export const insert = (data: NewSkinQualityData, dbInstance: DatabaseType = db) => {
	const schema = getSchema()
	return dbInstance
	.insert(schema)
	.values(data)
}
