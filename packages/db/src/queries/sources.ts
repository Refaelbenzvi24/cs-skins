import { db, schema as schemaList } from "../../index"
import { eq } from "drizzle-orm"


const tableName: keyof typeof schemaList = 'sources'

const getSchema = () => schemaList[tableName]

export const list = async () => {
	const schema = getSchema()
	return await
		db
		.select()
		.from(schema)
		.execute()
}

export const findOne = async () => {
	const schema = getSchema()
	return await
		db
		.select()
		.from(schema)
		.where(({url}) => eq(url, 'https://csgostash.com/'))
		.execute()
}
