import { db, schema as schemaList } from "../../index"
import type { InferInsert } from "../../types"


const tableName: keyof typeof schemaList = 'games'

const getSchema = () => schemaList[tableName]

export type NewGame = InferInsert<ReturnType<typeof getSchema>>

export const insert = async ({ data, connect }: { data: NewGame, connect?: {sourceId?: string} }) => {
	const schema = getSchema()
	const [game] = await
		db
		.insert(schema)
		.values(data)
		.returning()
		.execute()

	if (connect?.sourceId)
		await
			db
			.insert(schemaList.gamesSources)
			.values({ gameId: game!.id, sourceId: connect.sourceId })
			.returning()
			.execute()

	return game!
}

export const insertMany = async (input: NewGame[]) => {
	const schema = getSchema()
	return await
		db
		.insert(schema)
		.values(input)
		.returning()
		.execute()
}
