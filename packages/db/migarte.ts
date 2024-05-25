import { migrate } from "drizzle-orm/postgres-js/migrator"
import { db } from "./src"
import postgres from "postgres"


void (async () => {
	if(!process.env.DATABASE_URL){
		throw new Error("DATABASE_URL is not set");
	}
	await migrate(db, { migrationsFolder: './migrations' });

	const globalWithClient = global as typeof globalThis & {
		client: ReturnType<typeof postgres>
	};

	await globalWithClient.client.end()
})()
