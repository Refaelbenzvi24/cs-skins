import logger, { buildErrorCodesMapObject } from "@acme/logger"
import { errorTranslationKeys } from "./errorTranslationKeys"
import apm from "elastic-apm-node"


export const errorCodesMap = {
	E00001: buildErrorCodesMapObject({ severity: "ERROR", type: "UnknownError" }),
	E00002: buildErrorCodesMapObject({ severity: "ERROR", type: "DatabaseError", subName: "NotFound" }),
	E00003: buildErrorCodesMapObject({ severity: "ERROR", type: "DatabaseError", subName: "NotFound" }),
	E00004: buildErrorCodesMapObject({ severity: "ERROR", type: "DatabaseError", subName: "NotFound" }),
	E00005: buildErrorCodesMapObject({ severity: "ERROR", type: "ExternalService", subName: "Response" }),
	E00006: buildErrorCodesMapObject({ severity: "ERROR", type: "DatabaseError", subName: "InsertFailed" })
} as const


export const loggerInstance = logger.createInstance(errorCodesMap, errorTranslationKeys)({})
export const newError       = loggerInstance.errorBuilder
export const errorLogger    = loggerInstance.logger({
	errorTransformer:            'BaseError',
	unknownErrorsTranslationKey: 'errors:unknown',
	transports:                  [
		({ createTransport }) => createTransport({
			severities: ['CRITICAL', 'ERROR', 'WARNING', 'INFO'],
			callback: (error) => {
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
		}),
		({ createTransport }) => createTransport({
			severities: ['CRITICAL', 'ERROR', 'WARNING', 'INFO'],
			callback: (error) => {
				console.error(error)
			}
		})
	],
})
