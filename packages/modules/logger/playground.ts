import logger, { buildErrorCodesMapObject } from "./src"
import BaseError from "./src/Errors/BaseError"

const errorCodesMap = {
	E00001: buildErrorCodesMapObject({ severity: "ERROR", type: "UnknownError" }),
} as const


const errorTranslationKeys = {
	"errors:unknown":                                  "E00001",
} satisfies Record<string, keyof typeof errorCodesMap>
export const loggerInstance = logger.createInstance(errorCodesMap, errorTranslationKeys)({})
export const newError       = loggerInstance.errorBuilder
export const errorLogger       = loggerInstance.logger({
	errorTransformer:            'BaseError',
	unknownErrorsTranslationKey: 'errors:unknown',
	transports:                  [
		({ createTransport }) => createTransport({
			severities: ['CRITICAL', 'ERROR', 'WARNING', 'INFO'],
			callback:   (error) => {
				console.log(error)
			}
		})
	]
})


const playground = () => {
	try {
		throw new Error('Some error')
	} catch (error) {
		void errorLogger.logError(error, { extraDetails: { some: 'extra' } })
	}
}

playground ()
