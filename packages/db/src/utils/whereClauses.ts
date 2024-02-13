import { dbOperators } from "../index"
import type { SQLWrapper } from "drizzle-orm"
import type { DateRange, WithLimitParam } from "../../types/queryParams"


const equallyDistributedByRowNumber = (rowNumber: SQLWrapper, totalCount: SQLWrapper, {limit}: WithLimitParam) => {
	const { sql, eq, mod } = dbOperators
	return eq(mod(rowNumber, sql`${totalCount} / ${limit}`), sql`${totalCount} / ${limit} / 2 + 1`)
}

const dateRange = (timeStamp: SQLWrapper, {start, end}: DateRange) => {
	const { gte, lte, and } = dbOperators
	return and(gte(timeStamp, start), lte(timeStamp, end))
}

export default { equallyDistributedByRowNumber, dateRange }
