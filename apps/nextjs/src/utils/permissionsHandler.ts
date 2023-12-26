import _ from "lodash"
import type { UserPermissions } from "@acme/api/src/trpc"
import type { Session } from "@acme/auth"


export type PermissionsToCheckType = Record<string, UserPermissions>
export const handlePermissionsToCheck = <PermissionsToCheck extends PermissionsToCheckType>(session: Session | null, permissionsToCheck: PermissionsToCheck) => {
	if(!session?.user){
		return Object.entries(permissionsToCheck).reduce((acc, [key]) => {
			return {
				...acc,
				[key]: false
			}
		}, {}) as Record<keyof PermissionsToCheck, boolean>
	}

	return Object.entries(permissionsToCheck).reduce((acc, [key, value]) => {
		return {
			...acc,
			[key]: value.includes('admin') && value.every((permission) => _.get(session.user!.permissions, permission))
		}
	}, {}) as Record<keyof PermissionsToCheck, boolean>
}
