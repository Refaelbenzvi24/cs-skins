import * as nextAuthJwt from "next-auth/jwt"
import type { PermissionsType } from "@acme/db/src/schema/auth"

declare module "next-auth/jwt" {

	interface JWT {
		permissions: PermissionsType
	}

	export default { ...nextAuthJwt }
}

declare module "next-auth" {
	import type { DefaultSession } from "@auth/core/types"

	interface User {
		id: string;
		permissions: PermissionsType
	}

	interface Session extends DefaultSession {
		user?: User;
	}
}
