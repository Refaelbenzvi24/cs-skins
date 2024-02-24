import { ErrorNameOptions, errorSeverity } from "./Errors/BaseError"
import { buildErrorCodesMapObject } from "./errorCodesMap"
import errorBuilder from "./errorBuilder"
import { MaybePromise } from "../types"
import createTransport from "./createTransport"
import errors, { ErrorByType } from "./Errors"


type TransportsType<
	ErrorTransformer extends keyof typeof errors,
	ErrorCodesMap extends Record<string, ReturnType<typeof buildErrorCodesMapObject>>,
	ErrorTranslationKeys extends Record<string, keyof ErrorCodesMap>
> = (logger: {
	createTransport: typeof createTransport<
		ErrorCodesMap,
		ErrorTranslationKeys,
		ErrorTransformer
	>
}) => {
	callback: (error: ErrorByType<
		ErrorTransformer,
		ErrorCodesMap,
		ErrorTranslationKeys,
		Extract<keyof ErrorTranslationKeys, string>,
		ErrorNameOptions,
		keyof ErrorCodesMap
	>, extraDetails?: Record<string, unknown>) => MaybePromise<void>
	retries?: number
	retryDelay?: number
	severities: typeof errorSeverity[number][]
	killProcessOnFailure?: boolean
}

interface ErrorLoggerProps<
	ErrorTransformer extends keyof typeof errors,
	ErrorCodesMap extends Record<string, ReturnType<typeof buildErrorCodesMapObject>>,
	ErrorTranslationKeys extends Record<string, keyof ErrorCodesMap>
> {
	transports: TransportsType<
		ErrorTransformer,
		ErrorCodesMap,
		ErrorTranslationKeys
	>[],
	unknownErrorsTranslationKey: Extract<keyof ErrorTranslationKeys, string>
	errorTransformer: ErrorTransformer
}

const logger = <
	ErrorCodesMap extends Record<string, ReturnType<typeof buildErrorCodesMapObject>>,
	ErrorTranslationKeys extends Record<string, keyof ErrorCodesMap>,
	ErrorBuilder extends ReturnType<ReturnType<typeof errorBuilder<ErrorCodesMap, ErrorTranslationKeys>>>
>(errorBuilderInstance: ErrorBuilder) => <
	ErrorTransformer extends keyof typeof errors
>(errorLoggerProps: ErrorLoggerProps<
	ErrorTransformer,
	ErrorCodesMap,
	ErrorTranslationKeys
>) => {
	const { transports, errorTransformer, unknownErrorsTranslationKey } = errorLoggerProps

	const createdTransports = transports.map((transport) => transport({ createTransport }))
	const logError          = async (error: unknown, extraDetails?: Record<string, unknown>) => {
		const baseError    = errors[errorTransformer].from<ErrorCodesMap, ErrorTranslationKeys, ErrorBuilder>({
			errorBuilderInstance,
			errorTranslationKey: unknownErrorsTranslationKey
		}, error, extraDetails)
		const parsedError  = await baseError.parseError()
		let retriesCounter = 0
		await Promise.all(createdTransports.map(async (transport) => {
			const { callback, retries = 0, retryDelay = 500, killProcessOnFailure = false } = transport
			const withRetries                                                               = async () => {
				try {
					await callback(parsedError as ErrorByType<
						ErrorTransformer,
						ErrorCodesMap,
						ErrorTranslationKeys,
						Extract<keyof ErrorTranslationKeys, string>,
						ErrorNameOptions,
						keyof ErrorCodesMap
					>, extraDetails)
				} catch {
					if(retriesCounter < retries){
						retriesCounter++
						await new Promise((resolve) => setTimeout(resolve, retryDelay))
						await withRetries()
						return;
					}
					if(killProcessOnFailure){
						process.exit(1)
					}
				}
			}
			await withRetries()
		}))
	}
	return { logError }
}

export default logger
