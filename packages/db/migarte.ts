import { migrate } from "drizzle-orm/postgres-js/migrator"
import { db } from "./src"


void (async () => {
	if(!process.env.DATABASE_URL){
		throw new Error("DATABASE_URL is not set");
	}
	await migrate(db, { migrationsFolder: './migrations' });

	await global.client.end()
})()
