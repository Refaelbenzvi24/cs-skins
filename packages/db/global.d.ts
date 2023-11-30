import type postgres from "postgres"

declare global {
	// eslint-disable-next-line no-var
	var client: ReturnType<typeof postgres>;
}
