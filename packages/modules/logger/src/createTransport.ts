import { buildErrorCodesMapObject } from "./errorCodesMap"
import { ErrorNameOptions, errorSeverity } from "./Errors/BaseError"
import { MaybePromise } from "../types"
import errorBuilder from "./errorBuilder"
import errors, { ErrorByErrorType } from "./Errors"


export interface CreateTransportProps<
	ErrorCodesMap extends Record<string, ReturnType<typeof buildErrorCodesMapObject>>,
	ErrorTranslationKeys extends Record<string, keyof ErrorCodesMap>,
	ErrorTransformer extends keyof typeof errors,
> {
	severities: typeof errorSeverity[number][]
	retries?: number
	retryDelay?: number
	unknownErrorsTranslationKey: Extract<keyof ErrorTranslationKeys, string>
	killProcessOnFailure?: boolean
	callback: (error: ErrorByErrorType<
		ErrorTransformer,
		ErrorCodesMap,
		ErrorTranslationKeys,
		Extract<keyof ErrorTranslationKeys, string>,
		ErrorNameOptions,
		keyof ErrorCodesMap
	>) => MaybePromise<void>
}

const createTransport = <
	ErrorCodesMap extends Record<string, ReturnType<typeof buildErrorCodesMapObject>>,
	ErrorTranslationKeys extends Record<string, keyof ErrorCodesMap>,
	ErrorBuilder extends ReturnType<ReturnType<typeof errorBuilder<ErrorCodesMap, ErrorTranslationKeys>>>,
	ErrorTransformer extends keyof typeof errors,
>(errorBuilderInstance: ErrorBuilder, errorTransformer: ErrorTransformer) =>
	(props: CreateTransportProps<
		ErrorCodesMap,
		ErrorTranslationKeys,
		ErrorTransformer
	>) => {
		const { callback, unknownErrorsTranslationKey, retries, retryDelay, severities, killProcessOnFailure } = props
		const transportCallback                                                                                = async (error: unknown, generalInfo?: Record<string, unknown>) => {
			const baseError   = errors[errorTransformer].from<ErrorCodesMap, ErrorTranslationKeys, ErrorBuilder>({
				errorBuilderInstance,
				errorTranslationKey: unknownErrorsTranslationKey
			}, error, generalInfo)
			const parsedError = await baseError.parseError()
			if(severities.includes(baseError.severity) && !parsedError.isLogged){
				return callback(parsedError as ErrorByErrorType<
					ErrorTransformer,
					ErrorCodesMap,
					ErrorTranslationKeys,
					Extract<keyof ErrorTranslationKeys, string>,
					ErrorNameOptions,
					keyof ErrorCodesMap
				>)
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
