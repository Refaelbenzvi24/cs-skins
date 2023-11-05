import { db, schema as schemaList } from "../../index"
import type { InferInsert } from "../../types"


const tableName: keyof typeof schemaList = 'sources'

const getSchema = () => schemaList[tableName]

export type NewSource = InferInsert<ReturnType<typeof getSchema>>

export const insert = async ({ data, connect }: { data: NewSource, connect?: { gameId?: string, weaponId?: string } }) => {
	const schema   = getSchema()
	const [source] = await
		db
		.insert(schema)
		.values(data)
		.returning()
		.execute()

	if(connect?.gameId){
		await
			db
			.insert(schemaList.gamesSources)
			.values({ sourceId: source!.id, gameId: connect.gameId })
			.returning()
			.execute()
	}

	if(connect?.weaponId){
		await
			db
			.insert(schemaList.sourcesWeapons)
			.values({ sourceId: source!.id, weaponId: connect.weaponId })
			.returning()
			.execute()
	}

	return source!
}

export const insertMany = async ({ data, connect }: { data: NewSource[], connect?: { gameId?: string, weaponId?: string } }) => {
	const schema  = getSchema()
	const sources = await
		db
		.insert(schema)
		.values(data)
		.returning()
		.execute()

	if(connect?.gameId){
		const gamesSources = sources.map(({ id }) => ({ sourceId: id, gameId: connect.gameId! }))
		await
			db
			.insert(schemaList.gamesSources)
			.values(gamesSources)
			.returning()
			.execute()
	}

	if(connect?.weaponId){
		const sourcesWeapons = sources.map(({ id }) => ({ sourceId: id, weaponId: connect.weaponId! }))
		await
			db
			.insert(schemaList.sourcesWeapons)
			.values(sourcesWeapons)
			.returning()
			.execute()
	}

	return sources
}
