import BaseError from "./Errors/BaseError"
import TRPCError, { TRPCErrorOptions } from "./Errors/TRPCError"
import { buildErrorCodesMapObject, ErrorParams } from "./errorCodesMap"

import servicesMap from "./servicesMap"

export const errors = {
	BaseError,
	TRPCError
}


export interface OverrideErrorCodesMapObjectWithExtraDetails extends Partial<Omit<ErrorOptions, 'errorCode' | 'message' | 'loggedAtService' | 'userId' | 'name' | 'initializedAtService' | 'severity'>> {
	extraDetails?: unknown
}

const errorBuilder = <
	ErrorCodesMap extends Record<string, ReturnType<typeof buildErrorCodesMapObject>>,
	ErrorTranslationKeys extends Record<string, keyof ErrorCodesMap>
>(errorCodesMap: ErrorCodesMap, errorTranslationKeys: ErrorTranslationKeys) => (details: ErrorParams) => ({
	BaseError: (key: keyof ErrorTranslationKeys, options?: OverrideErrorCodesMapObjectWithExtraDetails) => new BaseError({
		...errorCodesMap[errorTranslationKeys[key]](details),
		errorCode: errorTranslationKeys[key],
		message:   key,
		...options
	}),
	TRPCError: (key: keyof ErrorTranslationKeys, code: TRPCErrorOptions['code'], options?: OverrideErrorCodesMapObjectWithExtraDetails) => new TRPCError({
		...errorCodesMap[errorTranslationKeys[key]](details),
		errorCode: errorTranslationKeys[key],
		message:   key,
		...options,
		code
	})
})

const logger = {
	errors,
	servicesMap,
	errorBuilder
}

export { buildErrorCodesMapObject } from "./errorCodesMap"
export default logger
