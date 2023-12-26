"use client";
import { useSession } from "next-auth/react"
import type { PermissionsToCheckType } from "~/utils/permissionsHandler";
import { handlePermissionsToCheck } from "~/utils/permissionsHandler"


const useCheckForPermissions = <PermissionsToCheck extends PermissionsToCheckType>(permissionsToCheck: PermissionsToCheck) => {
	const { data } = useSession()

	return handlePermissionsToCheck(data, permissionsToCheck)
}

export default useCheckForPermissions
