import { buildErrorCodesMapObject } from "./errorCodesMap"
import BaseError, { ErrorNameOptions, errorSeverity } from "./Errors/BaseError"
import { MaybePromise } from "../types"
import errorBuilder from "./errorBuilder"
import errors, { ErrorByType } from "./Errors"
import TRPCError from "./Errors/TRPCError"


export interface CreateTransportProps<
	ErrorCodesMap extends Record<string, ReturnType<typeof buildErrorCodesMapObject>>,
	ErrorTranslationKeys extends Record<string, keyof ErrorCodesMap>,
	ErrorTransformer extends keyof typeof errors,
> {
	severities: typeof errorSeverity[number][]
	retries?: number
	retryDelay?: number
	killProcessOnFailure?: boolean
	callback: (error: ErrorByType<
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
	ErrorTransformer extends keyof typeof errors,
>(props: CreateTransportProps<
	ErrorCodesMap,
	ErrorTranslationKeys,
	ErrorTransformer
>) => {
	const { callback, retries, retryDelay, severities, killProcessOnFailure } = props
	const transportCallback                                                   = async (error: ErrorByType<
		ErrorTransformer,
		ErrorCodesMap,
		ErrorTranslationKeys,
		Extract<keyof ErrorTranslationKeys, string>,
		ErrorNameOptions,
		keyof ErrorCodesMap
	>) => {
		if(severities.includes(error.severity) && !error.isLogged){
			return callback(error as ErrorByType<
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
