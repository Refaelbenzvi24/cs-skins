import BaseError, { ErrorNameOptions, errorNames, errorSeverity } from "./Errors/BaseError"
import TRPCError from "./Errors/TRPCError"
import { buildErrorCodesMapObject } from "./errorCodesMap"
import errorBuilder from "./errorBuilder"
import { MaybePromise } from "../types"
import createTransport, { CreateTransportProps } from "./createTransport"
import errors from "./Errors"


type TransportsType<
	ErrorCodesMap extends Record<string, ReturnType<typeof buildErrorCodesMapObject>>,
	ErrorTranslationKeys extends Record<`errors:${string}`, keyof ErrorCodesMap>,
	ErrorName extends ErrorNameOptions,
	ErrorCode extends keyof ErrorCodesMap,
	ExtraDetails extends Record<string, unknown> | undefined = undefined
> = (logger: {
	createTransport: (props: CreateTransportProps<
		ErrorCodesMap,
		ErrorTranslationKeys
	>) => {
		callback: (error: BaseError<
			ErrorCodesMap,
			ErrorTranslationKeys,
			keyof Pick<ErrorTranslationKeys, `errors:${string}`>,
			ErrorName,
			ErrorCode,
			ExtraDetails
		> | TRPCError<
			ErrorCodesMap,
			ErrorTranslationKeys,
			keyof Pick<ErrorTranslationKeys, `errors:${string}`>,
			ErrorName,
			ErrorCode,
			ExtraDetails
		> | unknown) => MaybePromise<void>
		retries?: number
		retryDelay?: number
		severities: typeof errorSeverity[number][]
		killProcessOnFailure?: boolean
	}
}) => {
	callback?: (error: unknown, extraDetails?: Record<string, unknown>) => MaybePromise<void>
	retries?: number
	retryDelay?: number
	severities: typeof errorSeverity[number][]
	killProcessOnFailure?: boolean
}

interface ErrorLoggerProps<
	ErrorTransformer extends keyof typeof errors,
	ErrorCodesMap extends Record<string, ReturnType<typeof buildErrorCodesMapObject>>,
	ErrorTranslationKeys extends Record<`errors:${string}`, keyof ErrorCodesMap>,
	ErrorName extends ErrorNameOptions,
	ErrorCode extends keyof ErrorCodesMap,
	ExtraDetails extends Record<string, unknown> | undefined = undefined
> {
	transports: TransportsType<
		ErrorCodesMap,
		ErrorTranslationKeys,
		ErrorName,
		ErrorCode,
		ExtraDetails
	>[],
	errorTransformer: ErrorTransformer
}

const logger = <
	ErrorTransformer extends keyof typeof errors,
	ErrorCodesMap extends Record<string, ReturnType<typeof buildErrorCodesMapObject>>,
	ErrorTranslationKeys extends Record<`errors:${string}`, keyof ErrorCodesMap>,
	ErrorBuilder extends ReturnType<ReturnType<typeof errorBuilder<ErrorCodesMap, ErrorTranslationKeys>>>,
>(errorBuilderInstance: ErrorBuilder) =>
	(errorLoggerProps: ErrorLoggerProps<
		ErrorTransformer,
		ErrorCodesMap,
		ErrorTranslationKeys,
		keyof typeof errorNames,
		keyof ErrorCodesMap
	>) => {
		const { transports, errorTransformer } = errorLoggerProps
		const createdTransports                = transports.map((transport) => transport({ createTransport: createTransport(errorBuilderInstance, errorTransformer) }))
		const logError                         = async (error: unknown, extraDetails?: Record<string, unknown>) => {
			let retriesCounter = 0
			await Promise.all(createdTransports.map(async (transport) => {
				const { callback, retries = 0, retryDelay = 500, killProcessOnFailure = false } = transport
				try {
					if(callback){
						return await callback(error, extraDetails)
					}
					retriesCounter = 0
				} catch {
					if(retries > retriesCounter){
						if(retryDelay){
							// TODO: check this - maybe it should resolve somehow the logError function in the setTimeout, check that the function really wait for the callback in the recursion
							return setTimeout(() => {
								logError(error, extraDetails)
								retriesCounter++
							}, retryDelay)
						}
						retriesCounter++
						return logError(error, extraDetails)
					}
					if(killProcessOnFailure){
						process.exit(1)
					}
				}
			}))
		}

		return {
			logError,

		}
	}

export default logger
