import { dbOperators } from "../index"
import type { BinaryOperator, SQL, SQLWrapper } from "drizzle-orm"
import { bindIfParam } from "drizzle-orm"


const mod: BinaryOperator = (left: SQLWrapper, right: unknown): SQL => {
	const { sql } = dbOperators
	return sql`mod(${left}, ${bindIfParam(right, left)})`
}

export function rowNumber(expression?: SQLWrapper, over?: SQLWrapper): SQL<number> {
	const { sql } = dbOperators
	return sql`row_number(${expression}) ${over}`.mapWith(Number);
}

export function over(expression?: SQLWrapper): SQL {
	const { sql } = dbOperators
	return sql`over(${expression ?? ''})`
}

export function avgPartitionedOverTimeStamp(expression?: SQLWrapper, timeStamp?: SQLWrapper): SQL<number> {
	const { sql } = dbOperators
	return sql`
				AVG(${expression ?? ''})
	             OVER (
	                 PARTITION BY
	                     EXTRACT('minute' FROM ${timeStamp ?? ''}),
	                     EXTRACT('hour' FROM ${timeStamp ?? ''}),
	                     EXTRACT('day' FROM ${timeStamp ?? ''}),
	                     EXTRACT('month' FROM ${timeStamp ?? ''}),
	                     EXTRACT('year' FROM ${timeStamp ?? ''})
	                 )
	                 `.mapWith(Number)
}

export default { mod, rowNumber, over, avgPartitionedOverTimeStamp }
