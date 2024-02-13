import { db, dbHelper, schema } from "./index"
import type { InferInsert } from "../types"


export type NewGames = InferInsert<typeof schema.games>
export type NewSource = Parameters<typeof dbHelper.mutate.sources.insert>[0]
export type NewQuality = InferInsert<typeof schema.qualities>

const games = [
	{ name: "CS GO" }
] satisfies NewGames[]

// TODO: add static id for seeded data
const sources = [
	{
		connect: { gameId: "CS GO" },
		data:    {

			url:  "https://csgostash.com",
			name: "CS Go Stash",
		}
	},
	{
		connect: { gameId: "CS GO" },
		data:    {
			url:  "https://bitskins.com",
			name: "Bit Skins",
		},
	},
	{
		connect: { gameId: "CS GO" },
		data:    {
			url:  "https://steamcommunity.com/market",
			name: "Steam",
		},
	},
	{
		connect: { gameId: "CS GO" },
		data:    {
			url:  "https://loot.farm/",
			name: "Loot Farm",
		},
	},
	{
		connect: { gameId: "CS GO" },
		data:    {
			url:  "https://cs.deals/",
			name: "CS Deals",
		},
	},
	{
		connect: { gameId: "CS GO" },
		data:    {
			url:  "https://skinport.com/",
			name: "Skin Port",
		},
	},
	{
		connect: { gameId: "CS GO" },
		data:    {
			url:  "https://cs.money/",
			name: "CS Money",
		},
	},
	{
		connect: { gameId: "CS GO" },
		data:    {
			url:  "https://tradeit.gg/",
			name: "Trade It",
		},
	},
	{
		connect: { gameId: "CS GO" },
		data:    {
			url:  "https://swap.gg/",
			name: "Swap gg",
		},
	},
	{
		connect: { gameId: "CS GO" },
		data:    {
			url:  "https://skinsjar.com/",
			name: "Skins Jar",
		},
	},
	{
		connect: { gameId: "CS GO" },
		data:    {
			url:  "https://skinbay.com/",
			name: "Skin Bay",
		},
	},
	{
		connect: { gameId: "CS GO" },
		data:    {
			url:  "https://skinsmonkey.com/",
			name: "Skins Monkey"
		},
	},
	{
		connect: { gameId: "CS GO" },
		data:    {
			url:  "https://waxpeer.com/",
			name: "Waxpeer"
		}
	}
] satisfies NewSource[]

const quality = [
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
] satisfies NewQuality[]

const seed = async () => {
	const insertedGames = await db.insert(schema.games).values(games).onConflictDoNothing().returning().execute()
	const sourcesSeed   = sources.map(source => ({
		...source,
		connect: { gameId: insertedGames.find(({ name }) => name === source.connect.gameId)!.id }
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
