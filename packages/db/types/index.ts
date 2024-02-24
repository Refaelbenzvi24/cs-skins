import type { Table } from "drizzle-orm"
import type { PgDatabase } from "drizzle-orm/pg-core/db"
import type { PostgresJsQueryResultHKT } from "drizzle-orm/postgres-js/session"
import type { schema as schemaList } from "../src";


export type InferInsert<SchemaType extends Table> = Omit<SchemaType['$inferInsert'], 'id' | 'updatedAt' | 'createdAt'>

export type DatabaseType = PgDatabase<PostgresJsQueryResultHKT, typeof schemaList>
