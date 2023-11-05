import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

import * as auth from "./src/schema/auth"
import * as skin from "./src/schema/skin"


export const schema = { ...auth, ...skin };

export { pgTable as tableCreator } from "./src/schema/_table";

import * as dbOperators from "drizzle-orm";
import * as extraDbOperators from "./src/helpers";

export { dbOperators }
export { extraDbOperators }

const connectionString = process.env.DATABASE_URL!
const client           = postgres(connectionString)
export const db        = drizzle(client, { schema });

export { dbHelper } from "./src/dbHelper"
