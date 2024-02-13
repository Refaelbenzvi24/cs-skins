import BaseError, { ErrorNameOptions, errorNames, errorSeverity } from "./Errors/BaseError"
import TRPCError from "./Errors/TRPCError"
import { buildErrorCodesMapObject } from "./errorCodesMap"
import errorBuilder from "./errorBuilder"
import { MaybePromise } from "../types"
import createTransport, { CreateTransportProps } from "./createTransport"
import errors from "./Errors"


type TransportsType<
	ErrorTransformer extends keyof typeof errors,
	ErrorCodesMap extends Record<string, ReturnType<typeof buildErrorCodesMapObject>>,
	ErrorTranslationKeys extends Record<string, keyof ErrorCodesMap>,
	ErrorName extends ErrorNameOptions,
	ErrorCode extends keyof ErrorCodesMap,
	ExtraDetails extends Record<string, unknown> | undefined = undefined,
> = (logger: {
	createTransport: (props: CreateTransportProps<
		ErrorCodesMap,
		ErrorTranslationKeys,
		ErrorTransformer
	>) => {
		callback: (error: BaseError<
			ErrorCodesMap,
			ErrorTranslationKeys,
			Exclude<keyof ErrorTranslationKeys, number | symbol>,
			ErrorName,
			ErrorCode,
			ExtraDetails
		> | TRPCError<
			ErrorCodesMap,
			ErrorTranslationKeys,
			Exclude<keyof ErrorTranslationKeys, number | symbol>,
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
	callback: (error: unknown, extraDetails?: Record<string, unknown>) => MaybePromise<void>
	retries?: number
	retryDelay?: number
	severities: typeof errorSeverity[number][]
	killProcessOnFailure?: boolean
}

interface ErrorLoggerProps<
	ErrorTransformer extends keyof typeof errors,
	ErrorCodesMap extends Record<string, ReturnType<typeof buildErrorCodesMapObject>>,
	ErrorTranslationKeys extends Record<string, keyof ErrorCodesMap>,
	ErrorName extends ErrorNameOptions,
	ErrorCode extends keyof ErrorCodesMap,
	ExtraDetails extends Record<string, unknown> | undefined = undefined
> {
	transports: TransportsType<
		ErrorTransformer,
		ErrorCodesMap,
		ErrorTranslationKeys,
		ErrorName,
		ErrorCode,
		ExtraDetails
	>[],
	errorTransformer: ErrorTransformer
}

const logger = <
	ErrorCodesMap extends Record<string, ReturnType<typeof buildErrorCodesMapObject>>,
	ErrorTranslationKeys extends Record<string, keyof ErrorCodesMap>,
	ErrorBuilder extends ReturnType<ReturnType<typeof errorBuilder<ErrorCodesMap, ErrorTranslationKeys>>>
>(errorBuilderInstance: ErrorBuilder) =>
	<
		ErrorTransformer extends keyof typeof errors
	>(errorLoggerProps: ErrorLoggerProps<
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
				const withRetries                                                               = async () => {
					try {
						await callback(error, extraDetails)
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
