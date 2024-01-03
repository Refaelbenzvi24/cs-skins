import * as nextAuthJwt from "next-auth/jwt"

declare module "next-auth/jwt" {
	import { Permissions } from "@acme/db/src/schema/auth"

	interface JWT {
		permissions: Permissions
	}

	export default { ...nextAuthJwt }
}

declare module "next-auth" {
	import type { DefaultSession } from "@auth/core/types"

	interface User {
		id: string;
		permissions: Permissions
	}

	interface Session extends DefaultSession {
		user?: User;
	}
}
