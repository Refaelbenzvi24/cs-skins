import type { Table } from "drizzle-orm"


export type InferInsert<SchemaType extends Table> = Omit<SchemaType['$inferInsert'], 'id' | 'updatedAt' | 'createdAt'>
