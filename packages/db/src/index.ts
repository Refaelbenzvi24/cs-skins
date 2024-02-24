import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

import * as auth from "./schema/auth"
import * as skin from "./schema/skin"


export const schema = { ...auth, ...skin };

export { pgTable as tableCreator } from "./schema/_table";

import * as drizzleDbOperators from "drizzle-orm";

import * as extraDbOperators from "./utils";
import { extendedDbOperators } from "./utils"


export const dbOperators = { ...drizzleDbOperators, ...extendedDbOperators }
export { extraDbOperators }

const connectionString = process.env.DATABASE_URL!
let client: ReturnType<typeof postgres>
const globalWithClient = global as typeof globalThis & {
	client: typeof client;
};
if(process.env.NODE_ENV === "production"){
	client = postgres(connectionString);
} else {
	if(!globalWithClient.client){
		globalWithClient.client = postgres(connectionString);
	}

	client = globalWithClient.client;
}

export const db = drizzle(client, { schema });

export { dbHelper } from "./dbHelper"
