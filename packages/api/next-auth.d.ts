import * as nextAuthJwt from "next-auth/jwt"


declare module "next-auth/jwt" {
	import type { Permissions } from "@acme/db/src/schema/auth"

	interface JWT {
		permissions: Permissions
	}
}

declare module "next-auth" {
	import type { DefaultSession as Session } from "next-auth"

	interface User {
		id: string;
		permissions: Permissions
	}

	interface DefaultSession extends Session {
		user?: User;
	}
}
