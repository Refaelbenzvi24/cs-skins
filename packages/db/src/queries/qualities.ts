import { db, dbOperators, schema as schemaList } from "../../index"
import { addOperatorByParametersNil } from "../helpers"
import type { PaginateWithSearchParams } from "../../types/queryParams"


const tableName: keyof typeof schemaList = "qualities"

const getSchema = () => schemaList[tableName]

const list = ({ cursor, limit, search }: PaginateWithSearchParams) => {
	const schema = getSchema ()
	const { gt, desc, like, and } = dbOperators
	return db
		.select ()
		.from (schema)
		.orderBy (({ id }) => desc (id))
		.where ((queryData) => and (
			addOperatorByParametersNil ({ cursor }, ({ cursor }) => gt (queryData.id, cursor)),
			addOperatorByParametersNil({ search }, ({ search }) => like (queryData.name, `${search}`))
		))
		.limit (limit ?? 20)
}

export default { list }
