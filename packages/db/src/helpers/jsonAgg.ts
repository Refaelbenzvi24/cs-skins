
import type { InferModel, AnyTable} from "drizzle-orm";
import { sql } from "drizzle-orm";
import type {AnyColumn, SQL} from "drizzle-orm";
import type {SelectedFields, TableConfig} from "drizzle-orm/pg-core";
import type {SelectResultFields} from "drizzle-orm/query-builders/select.types";

export function takeFirst<T>(items: T[]) {
	return items.at(0);
}

export function takeFirstOrThrow<T>(items: T[]) {
	const first = takeFirst(items);

	if (!first) {
		throw new Error("First item not found");
	}

	return first;
}

export function distinct<Column extends AnyColumn>(column: Column) {
	return sql<Column["_"]["data"]>`distinct(${column})`;
}

export function distinctOn<Column extends AnyColumn>(column: Column) {
	return sql<Column["_"]["data"]>`distinct on (${column}) ${column}`;
}

export function max<Column extends AnyColumn>(column: Column) {
	return sql<Column["_"]["data"]>`max(${column})`;
}

export function count<Column extends AnyColumn>(column: Column) {
	return sql<number>`cast(count(${column}) as integer)`;
}

/**
 * Coalesce a value to a default value if the value is null
 *
 */
export function coalesce<T>(value: SQL.Aliased<T>, defaultValue: T) {
	return sql<T>`coalesce(${value}, ${defaultValue})`;
}

type Unit = "minutes" | "minute";
type Operator = "+" | "-";

export function now(interval?: `${Operator} interval ${number} ${Unit}`) {
	return sql<string>`now() ${interval ?? ""}`;
}

// ⚠️ Potential for SQL injections, so you shouldn't allow user-specified key names
export function jsonAggBuildObject<T extends SelectedFields>(shape: T) {
	const chunks: SQL[] = [];

	Object.entries(shape).forEach(([key, value]) => {
		if (chunks.length > 0) {
			chunks.push(sql.raw(`,`));
		}
		chunks.push(sql.raw(`'${key}',`));
		chunks.push(sql`${value}`);
	});

	return sql<
		SelectResultFields<T>[]
	>`coalesce(json_agg(distinct jsonb_build_object(${sql.join(
		chunks,
	)})), '[]')`;
}

// with filter non-null
export function jsonAgg<Table extends AnyTable<TableConfig>>(table: Table) {
	return sql<
		InferModel<Table>[]
	>`coalesce(json_agg(${table}) filter (where ${table} is not null), '[]')`;
}

// generalist
// export function jsonAgg<Table extends AnyTable<TableConfig>>(table: Table) {
// 	return sql<InferModel<Table>[]>`coalesce(json_agg(${table}), '[]')`;
// }
