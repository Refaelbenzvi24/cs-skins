import { db, dbHelper, schema } from "../index"
import type { InferInsert } from "../types"


export type NewGames = InferInsert<typeof schema.games>
export type NewSource = Parameters<typeof dbHelper.mutate.sources.insert>[0]
export type NewQuality = InferInsert<typeof schema.qualities>

const games: NewGames[] = [
	{ name: "csgo" }
]

const sources: NewSource[] = [
	{
		connect: { gameId: "csgo" },
		data:    {
			url:  "https://csgostash.com",
			name: "csgostash",
		}
	},
	{
		connect: { gameId: "csgo" },
		data:    {
			url:  "https://bitskins.com",
			name: "bitskins",
		},
	},
	{
		connect: { gameId: "csgo" },
		data:    {
			url:  "https://steamcommunity.com/market",
			name: "steam",
		},
	},
	{
		connect: { gameId: "csgo" },
		data:    {
			url:  "https://loot.farm/",
			name: "lootfarm",
		},
	},
	{
		connect: { gameId: "csgo" },
		data:    {
			url:  "https://cs.deals/",
			name: "csdeals",
		},
	},
	{
		connect: { gameId: "csgo" },
		data:    {
			url:  "https://skinport.com/",
			name: "skinport",
		},
	},
	{
		connect: { gameId: "csgo" },
		data:    {
			url:  "https://cs.money/",
			name: "csmoney",
		},
	},
	{
		connect: { gameId: "csgo" },
		data:    {
			url:  "https://tradeit.gg/",
			name: "tradeit",
		},
	},
	{
		connect: { gameId: "csgo" },
		data:    {
			url:  "https://swap.gg/",
			name: "swapgg",
		},
	},
	{
		connect: { gameId: "csgo" },
		data:    {
			url:  "https://skinsjar.com/",
			name: "skinsjar",
		},
	},
	{
		connect: { gameId: "csgo" },
		data:    {
			url:  "https://skinbay.com/",
			name: "skinbay",
		},
	},
	{
		connect: { gameId: "csgo" },
		data:    {
			url:  "https://skinsmonkey.com/",
			name: "skinsmonkey"
		},
	}
]

const quality: NewQuality[] = [
	{ name: "Field-Tested" },
	{ name: "StatTrak Well-Worn" },
	{ name: "Battle-Scarred" },
	{ name: "Well-Worn" },
	{ name: "StatTrak Minimal Wear" },
	{ name: "Minimal Wear" },
	{ name: "StatTrak Field-Tested" },
	{ name: "Factory New" },
	{ name: "StatTrak Factory New" },
	{ name: "StatTrak Battle-Scarred" }
]

const seed = async () => {
	const insertedGames = await db.insert(schema.games).values(games).onConflictDoNothing().returning().execute()
	const sourcesSeed   = sources.map(source => ({
		...source,
		connect: { gameId: insertedGames.find(({ name }) => name === source.connect!.gameId)!.id }
	}))
	await Promise.all(sourcesSeed.map(async source => await dbHelper.mutate.sources.insert(source)))
	await db.insert(schema.qualities).values(quality).onConflictDoNothing().execute()
}

void (async () => {
	try {
		await seed()
		console.log("Seed successful");
		process.exit(0);
	} catch (error) {
		console.error("Seed failed");
		console.error(error);
		process.exit(1);
	}
})()
