import BaseError, { ErrorNameOptions } from "./BaseError"
import TRPCError from "./TRPCError"
import { buildErrorCodesMapObject } from "../errorCodesMap"


const errors = {
	BaseError,
	TRPCError
} as const

interface ErrorTypes<
	ErrorCodesMap extends Record<string, ReturnType<typeof buildErrorCodesMapObject>>,
	ErrorTranslationKeys extends Record<string, keyof ErrorCodesMap>,
	ErrorMessage extends Extract<keyof ErrorTranslationKeys, string>,
	ErrorName extends ErrorNameOptions,
	ErrorCode extends keyof ErrorCodesMap,
	ExtraDetails extends Record<string, unknown> | undefined = undefined
> {
	BaseError: BaseError<
		ErrorCodesMap,
		ErrorTranslationKeys,
		ErrorMessage,
		ErrorName,
		ErrorCode,
		ExtraDetails
	>
	TRPCError: TRPCError<
		ErrorCodesMap,
		ErrorTranslationKeys,
		ErrorMessage,
		ErrorName,
		ErrorCode,
		ExtraDetails
	>
}

export type ErrorByType<
	ErrorType extends keyof typeof errors,
	ErrorCodesMap extends Record<string, ReturnType<typeof buildErrorCodesMapObject>>,
	ErrorTranslationKeys extends Record<string, keyof ErrorCodesMap>,
	ErrorMessage extends Extract<keyof ErrorTranslationKeys, string>,
	ErrorName extends ErrorNameOptions,
	ErrorCode extends keyof ErrorCodesMap,
	ExtraDetails extends Record<string, unknown> | undefined = undefined
> = ErrorTypes<
	ErrorCodesMap,
	ErrorTranslationKeys,
	ErrorMessage,
	ErrorName,
	ErrorCode,
	ExtraDetails>[ErrorType]

export default errors
