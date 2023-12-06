import { db, dbOperators, schema as schemaList } from "../../index"
import { PaginateWithSearchParams } from "../../types/queryParams"
import { addOperatorByParametersNil } from "../helpers"


const tableName: keyof typeof schemaList = 'weapons'

const getSchema = () => schemaList[tableName]

const list = ({ limit, search, cursor }: PaginateWithSearchParams) => {
	const schema                  = getSchema()
	const { gt, desc, like, and } = dbOperators
	return db
	.select()
	.from(schema)
	.orderBy(({ id }) => desc(id))
	.where((queryData) => and(
		addOperatorByParametersNil({ cursor }, ({ cursor }) => gt(queryData.id, cursor)),
		addOperatorByParametersNil({ search }, ({ search }) => like(queryData.name, `${search}`))
	))
	.limit(limit ?? 20)
}

export default { list }
