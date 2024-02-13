import type postgres from "postgres"


declare global {
	declare namespace globalThis {
		// eslint-disable-next-line no-var
		var client: ReturnType<typeof postgres>
	}
}
