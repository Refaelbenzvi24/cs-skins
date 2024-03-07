import { handlePermissionsToCheck } from "~/utils/permissionsHandler"
import type { PermissionsToCheckType } from "~/utils/permissionsHandler";
import { auth } from "@acme/auth"


const checkForServerPermissions = async <PermissionsToCheck extends PermissionsToCheckType>(permissionsToCheck: PermissionsToCheck) => {
	const session = await auth()

	return handlePermissionsToCheck(session, permissionsToCheck)
}

export default checkForServerPermissions
