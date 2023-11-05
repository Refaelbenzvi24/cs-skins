import { db, schema as schemaList } from "../../index"


const tableName: keyof typeof schemaList = 'qualities'

const getSchema = () => schemaList[tableName]

export const list = async () => {
	const schema = getSchema()
	return await
		db
		.select()
		.from(schema)
		.execute()
}
