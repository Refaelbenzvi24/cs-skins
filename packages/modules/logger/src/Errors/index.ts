import BaseError, { ErrorNameOptions } from "./BaseError"
import TRPCError from "./TRPCError"
import { buildErrorCodesMapObject } from "../errorCodesMap"


const errors = {
	BaseError,
	TRPCError
} as const

export type ErrorByErrorType<
	ErrorType extends keyof typeof errors,
	ErrorCodesMap extends Record<string, ReturnType<typeof buildErrorCodesMapObject>>,
	ErrorTranslationKeys extends Record<string, keyof ErrorCodesMap>,
	ErrorMessage extends Exclude<keyof ErrorTranslationKeys, number | symbol>,
	ErrorName extends ErrorNameOptions,
	ErrorCode extends keyof ErrorCodesMap,
	ExtraDetails extends Record<string, unknown> | undefined = undefined
> =
	ErrorType extends "BaseError" ?
		BaseError<
			ErrorCodesMap,
			ErrorTranslationKeys,
			ErrorMessage,
			ErrorName,
			ErrorCode,
			ExtraDetails
		> :
		ErrorType extends "TRPCError" ?
			TRPCError<
				ErrorCodesMap,
				ErrorTranslationKeys,
				ErrorMessage,
				ErrorName,
				ErrorCode,
				ExtraDetails
			> :
			unknown

export default errors
