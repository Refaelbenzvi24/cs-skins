import { db, schema as schemaList } from "../../index"
import type { InferInsert } from "../../types"


const tableName: keyof typeof schemaList = 'users'

const getSchema = () => schemaList[tableName]

export type NewUser = InferInsert<ReturnType<typeof getSchema>>

export const insert = ({ data }: { data: NewUser }) => {
	const schema = getSchema()
	return db
	.insert(schema)
	.values(data)
	.returning()
}

export const insertMany = (input: NewUser[]) => {
	const schema = getSchema()
	return db
	.insert(schema)
	.values(input)
	.returning()
}
