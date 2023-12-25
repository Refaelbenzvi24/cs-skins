import type { PaginateWithSearchParams } from "../../types/queryParams"
import { db, dbOperators, schema as schemaList } from "../../index"
import { addOperatorByParametersNil } from "../utils"


const tableName: keyof typeof schemaList = "users"

const getSchema = () => schemaList[tableName]
const list      = ({ cursor, search, limit }: PaginateWithSearchParams) => {
	const schema                      = getSchema()
	const { users }                   = schemaList
	const { gt, desc, like, or, and } = dbOperators
	return db
	.select({
		id:    users.id,
		name:  users.name,
		email: users.email
	})
	.from(schema)
	.orderBy(({ id }) => desc(id))
	.where((queryData) => and(
		addOperatorByParametersNil({ cursor }, ({ cursor }) => gt(queryData.id, cursor)),
		addOperatorByParametersNil({ search }, ({ search }) => or(
			like(queryData.name, `${search}`),
			like(queryData.email, `${search}`),
		))
	))
	.limit(limit ?? 20)
}

export default { list }
