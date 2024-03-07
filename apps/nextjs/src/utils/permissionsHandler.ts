import _ from "lodash"
import type { PermissionsFilter } from "@acme/api/src/trpc"
import type { Session } from "@acme/auth"


export type PermissionsToCheckType = Record<string, PermissionsFilter>
export const handlePermissionsToCheck = <PermissionsToCheck extends PermissionsToCheckType>(session: Session | null, permissionsToCheck: PermissionsToCheck) => {
	const userPermissions = session?.user?.permissions ?? {}
	if(!_.get(userPermissions, 'admin')){
		if(!session?.user){
			return Object.entries(permissionsToCheck).reduce((acc, [key]) => {
				return {
					...acc,
					[key]: false
				}
			}, {}) as Record<keyof PermissionsToCheck, boolean>
		}
	}

	return Object.entries(permissionsToCheck).reduce((acc, [key, value]) => {
		return {
			...acc,
			[key]: _.get(userPermissions, 'admin') ?? _.get(userPermissions, value)
		}
	}, {}) as Record<keyof PermissionsToCheck, boolean>
}
