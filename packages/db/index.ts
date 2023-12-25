import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

import * as auth from "./src/schema/auth"
import * as skin from "./src/schema/skin"


export const schema = { ...auth, ...skin };

export { pgTable as tableCreator } from "./src/schema/_table";

import * as drizzleDbOperators from "drizzle-orm";

import * as extraDbOperators from "./src/utils";
import { extendedDbOperators } from "./src/utils"

export const dbOperators = { ...drizzleDbOperators, ...extendedDbOperators }
export { extraDbOperators }

const connectionString = process.env.DATABASE_URL!
let client: ReturnType<typeof postgres>
if (process.env.NODE_ENV === "production") {
	client = postgres (connectionString);
} else {
	if (!global.client) {
		global.client = postgres (connectionString);
	}

	client = global.client;
}

export const db = drizzle (client, { schema });

export { dbHelper } from "./src/dbHelper"
