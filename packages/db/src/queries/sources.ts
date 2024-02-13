import { db, dbOperators, schema as schemaList } from "../index"
import { eq } from "drizzle-orm"
import type { PaginateWithSearchParams } from "../../types/queryParams"
import { addOperatorByParametersNil } from "../utils"


const tableName: keyof typeof schemaList = "sources"

const getSchema = () => schemaList[tableName]

const list = ({ cursor, search, limit }: PaginateWithSearchParams) => {
	const schema                      = getSchema()
	const { gt, desc, like, or, and } = dbOperators
	return db
	.select()
	.from(schema)
	.orderBy(({ id }) => desc(id))
	.where((queryData) => and(
		addOperatorByParametersNil({ cursor }, ({ cursor }) => gt(queryData.id, cursor)),
		addOperatorByParametersNil({ search }, ({ search }) => or(
			like(queryData.name, `${search}`),
			like(queryData.url, `${search}`)
		))
	))
	.limit(limit ?? 20)
}

const findOne = () => {
	const schema = getSchema()
	return db
	.select()
	.from(schema)
	.where(({ url }) => eq(url, "https://csgostash.com/"))
}

export default { list, findOne }
