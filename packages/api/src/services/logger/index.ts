import logger, { buildErrorCodesMapObject } from "@acme/logger"
import { auth } from "@acme/auth"
import { errorTranslationKeys } from "./errorTranslationKeys"


export const errorCodesMap = {
	E00001: buildErrorCodesMapObject({ severity: "ERROR", name: "AuthenticationError" }),
	E00002: buildErrorCodesMapObject({ severity: "ERROR", name: "AuthorizationError" }),
	E00003: buildErrorCodesMapObject({ severity: "ERROR", name: "PermissionError" }),
	E00004: buildErrorCodesMapObject({ severity: "ERROR", name: "UnknownError" })
} as const


export const loggerInstance = logger.createInstance(
	errorCodesMap, errorTranslationKeys
)({
	loggedAtService: "nextjs", initializedAtService: "nextjs", userIdGetter: async () => {
		const session = await auth()
		return session?.user?.id
	}
})
