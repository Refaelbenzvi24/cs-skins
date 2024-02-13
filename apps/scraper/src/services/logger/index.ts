import logger, { buildErrorCodesMapObject } from "@acme/logger"
import { errorTranslationKeys } from "./errorTranslationKeys"
import apm from "elastic-apm-node"


export const errorCodesMap = {
	E00001: buildErrorCodesMapObject({ severity: "ERROR", type: "UnknownError" }),
	E00002: buildErrorCodesMapObject({ severity: "ERROR", type: "DatabaseError", subName: "NotFound" }),
	E00003: buildErrorCodesMapObject({ severity: "ERROR", type: "DatabaseError", subName: "NotFound" })
} as const


export const loggerInstance = logger.createInstance(errorCodesMap, errorTranslationKeys)({})
export const newError       = loggerInstance.errorBuilder
export const logError       = loggerInstance.logger({
	errorTransformer: 'BaseError',
	transports:       [
		({ createTransport }) => createTransport({
			severities:                  ['CRITICAL', 'ERROR', 'WARNING', 'INFO'],
			unknownErrorsTranslationKey: 'errors:unknown',
			callback:                    (error) => {
				apm.captureError(error)
			}
		})
	]
}).logError
