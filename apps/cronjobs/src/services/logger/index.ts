import logger, { buildErrorCodesMapObject } from "@acme/logger"
import { errorTranslationKeys } from "./errorTranslationKeys"
import apm from "elastic-apm-node"


export const errorCodesMap = {
	E00001: buildErrorCodesMapObject({ severity: "ERROR", type: "UnknownError" }),
} as const


export const loggerInstance = logger.createInstance(errorCodesMap, errorTranslationKeys)({})
export const newError       = loggerInstance.errorBuilder
export const errorLogger    = loggerInstance.logger({
	errorTransformer:            'BaseError',
	unknownErrorsTranslationKey: 'errors:unknown',
	transports:                  [
		({ createTransport }) => createTransport({
			severities: ['CRITICAL', 'ERROR', 'WARNING', 'INFO'],
			callback:   (error) => {
				apm.captureError(error, {
					tags: {
						severity:  error.severity,
						type:      error.type,
						subType:   error.subType,
						errorCode: error.errorCode,
						extra:     error.extraDetails
					}
				})
			}
		})
	]
})
