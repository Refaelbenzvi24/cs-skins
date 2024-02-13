import logger, { buildErrorCodesMapObject } from "@acme/logger"
import { auth } from "@acme/auth"
import { errorTranslationKeys } from "./errorTranslationKeys"


export const errorCodesMap = {
	E00001: buildErrorCodesMapObject({ severity: "ERROR", type: "UnknownError" }),
	E00002: buildErrorCodesMapObject({ severity: "ERROR", type: "AuthenticationError" }),
	E00003: buildErrorCodesMapObject({ severity: "ERROR", type: "AuthorizationError" }),
	E00004: buildErrorCodesMapObject({ severity: "ERROR", type: "PermissionError" }),
	E00005: buildErrorCodesMapObject({ severity: "ERROR", type: "DatabaseError", subName: "NotFound" })
} as const


export const loggerInstance = logger.createInstance(
	errorCodesMap, errorTranslationKeys
)({
	userIdGetter: async () => {
		const session = await auth()
		return session?.user?.id
	}
})
