import { buildErrorCodesMapObject } from "./errorCodesMap"
import { errorSeverity } from "./Errors/BaseError"
import { MaybePromise } from "../types"
import errorBuilder from "./errorBuilder"
import errors from "./Errors"


export interface CreateTransportProps<
	ErrorCodesMap extends Record<string, ReturnType<typeof buildErrorCodesMapObject>>,
	ErrorTranslationKeys extends Record<string, keyof ErrorCodesMap>
> {
	severities: typeof errorSeverity[number][]
	retries?: number
	retryDelay?: number
	unknownErrorsTranslationKey: Exclude<keyof ErrorTranslationKeys, symbol | number>
	killProcessOnFailure?: boolean
	callback: (error: string) => MaybePromise<void>
}

const createTransport = <
	ErrorCodesMap extends Record<string, ReturnType<typeof buildErrorCodesMapObject>>,
	ErrorTranslationKeys extends Record<string, keyof ErrorCodesMap>,
	ErrorBuilder extends ReturnType<ReturnType<typeof errorBuilder<ErrorCodesMap, ErrorTranslationKeys>>>,
	ErrorTransformer extends keyof typeof errors,
>(errorBuilderInstance: ErrorBuilder, errorTransformer: ErrorTransformer) =>
	(props: CreateTransportProps<
		ErrorCodesMap,
		ErrorTranslationKeys
	>) => {
		const { callback, unknownErrorsTranslationKey, retries, retryDelay, severities, killProcessOnFailure } = props
		const transportCallback                                                                                = async (error: unknown, generalInfo?: Record<string, unknown>) => {
			const baseError   = errors[errorTransformer].from<ErrorCodesMap, ErrorTranslationKeys, ErrorBuilder>({
				errorBuilderInstance,
				errorTranslationKey: unknownErrorsTranslationKey
			}, error, generalInfo)
			const parsedError = await baseError.toString()
			if(severities.includes(baseError.severity)){
				return callback(parsedError)
			}
		}
		return {
			callback: transportCallback,
			retries,
			retryDelay,
			severities,
			killProcessOnFailure
		}
	}

export default createTransport
