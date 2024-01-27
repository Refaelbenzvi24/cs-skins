import { buildErrorCodesMapObject, ErrorParams } from "./errorCodesMap"
import BaseError from "./Errors/BaseError"
import TRPCError, { TRPCErrorOptions } from "./Errors/TRPCError"

export interface OverrideErrorCodesMapObjectWithExtraDetails extends Partial<Omit<ErrorOptions, 'errorCode' | 'message' | 'loggedAtService' | 'userId' | 'name' | 'initializedAtService' | 'severity'>> {
	extraDetails?: unknown
}

const errorBuilder = <
	ErrorCodesMap extends Record<string, ReturnType<typeof buildErrorCodesMapObject>>,
	ErrorTranslationKeys extends Record<string, keyof ErrorCodesMap>
>(errorCodesMap: ErrorCodesMap, errorTranslationKeys: ErrorTranslationKeys) => (details: ErrorParams) => ({
	BaseError: (key: keyof ErrorTranslationKeys, options?: OverrideErrorCodesMapObjectWithExtraDetails) => {
		return new BaseError({
			...(errorCodesMap[errorTranslationKeys[key]](details)),
			errorCode: errorTranslationKeys[key],
			message:   key,
			...options
		})
	},
	TRPCError: (key: keyof ErrorTranslationKeys, code: TRPCErrorOptions['code'], options?: OverrideErrorCodesMapObjectWithExtraDetails) => new TRPCError({
		...(errorCodesMap[errorTranslationKeys[key]](details)),
		errorCode: errorTranslationKeys[key],
		message:   key,
		...options,
		code
	})
})

export default errorBuilder
