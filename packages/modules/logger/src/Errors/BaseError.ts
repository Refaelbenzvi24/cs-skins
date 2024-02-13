import ServicesMap from "../servicesMap"
import { buildErrorCodesMapObject } from "../errorCodesMap"
import { createId } from "@paralleldrive/cuid2"
import { MaybePromise } from "../../types"
import errorBuilder from "../errorBuilder"
import TRPCError from "./TRPCError"
import _ from "lodash"


class UnknownCauseError extends Error {
	[key: string]: unknown;
}

export function isObject(value: unknown): value is Record<string, unknown>{
	// check that value is object
	return !!value && !Array.isArray(value) && typeof value === 'object';
}

export function getCauseFromUnknown(cause: unknown): Error | undefined{
	if(cause instanceof Error){
		return cause;
	}

	const type = typeof cause;
	if(type === 'undefined' || type === 'function' || cause === null){
		return undefined;
	}

	// Primitive types just get wrapped in an error
	if(type !== 'object'){
		return new Error(String(cause));
	}

	// If it's an object, we'll create a synthetic error
	if(isObject(cause)){
		const err = new UnknownCauseError();
		for (const key in cause) {
			err[key] = cause[key];
		}
		return err;
	}

	return undefined;
}

// const errorTypes    = [
// 	'UNKNOWN',
// 	'VALIDATION',
// 	'AUTHENTICATION',
// 	'AUTHORIZATION',
// 	'DATABASE',
// 	'EXTERNAL_SERVICE',
// 	'INTERNAL_SERVICE',
// 	'THIRD_PARTY_SERVICE',
// 	'UNHANDLED'
// ] as const
export const errorSeverity = ["INFO", "WARNING", "ERROR", "CRITICAL"] as const

export const errorNames = {
	"BaseError":           [],
	"UnknownError":        [],
	"ValidationError":     [],
	"AuthenticationError": [],
	"AuthorizationError":  [],
	"DatabaseError":       ["QueryFailed", "NotFound"],
	"PermissionError":     [],
	"MessageBroker":       ["Connection", "ChannelCreation", "SendingMessage", "AssertingQueue", "MessageConsuming", "PurgingQueue"]
} as const

export type ErrorNameOptions = keyof typeof errorNames

export interface ErrorOptions {
	severity: typeof errorSeverity[number]
	addSystemProcessId?: boolean
	userId?: string
	userIdGetter?: () => MaybePromise<string>
	cause?: unknown;
}

export interface ErrorOptionsWithGenerics<
	ErrorCodesMap extends Record<string, ReturnType<typeof buildErrorCodesMapObject>>,
	ErrorTranslationKeys extends Record<string, keyof ErrorCodesMap>,
	ErrorMessage extends keyof ErrorTranslationKeys,
	ErrorName extends ErrorNameOptions,
	ErrorCode extends keyof ErrorCodesMap,
	ExtraDetails extends Record<string, unknown> | undefined = undefined
> extends ErrorOptions {
	type: ErrorName
	subType?: typeof errorNames[ErrorName][number]
	message: ErrorMessage
	errorCode: ErrorCode
	extraDetails?: ExtraDetails
}

class BaseError<
	ErrorCodesMap extends Record<string, ReturnType<typeof buildErrorCodesMapObject>>,
	ErrorTranslationKeys extends Record<string, keyof ErrorCodesMap>,
	ErrorMessage extends Exclude<keyof ErrorTranslationKeys, number | symbol>,
	ErrorName extends ErrorNameOptions,
	ErrorCode extends keyof ErrorCodesMap,
	ExtraDetails extends Record<string, unknown> | undefined = undefined
> extends Error {
	public errorId: string
	public type: ErrorName
	public subType?: typeof errorNames[ErrorName][number]
	public systemProcessId?: string
	public userId?: string
	public userIdGetter?: () => MaybePromise<string>
	public severity: typeof errorSeverity[number]
	public extraDetails?: ExtraDetails
	public errorCode: ErrorCode
	public message: ErrorMessage
	public timestamp: string
	public isLogged: boolean

	constructor(options: ErrorOptionsWithGenerics<ErrorCodesMap, ErrorTranslationKeys, ErrorMessage, ErrorName, ErrorCode, ExtraDetails>){
		const cause   = getCauseFromUnknown(options.cause);
		const message = options.message ?? cause?.message;

		super(message, { cause });
		this.errorId      = createId()
		this.type         = options.type
		this.subType      = options.subType
		this.errorCode    = options.errorCode
		this.message      = options.message
		this.userId       = options.userId ?? "system"
		this.severity     = options.severity
		this.extraDetails = options.extraDetails
		this.userIdGetter = options.userIdGetter
		this.timestamp    = new Date().toISOString()
		this.isLogged     = false

		if(!this.cause){
			// idk why this is needed, but it is
			this.cause = cause;
		}
	}

	public static from<
		ErrorCodesMap extends Record<string, ReturnType<typeof buildErrorCodesMapObject>>,
		ErrorTranslationKeys extends Record<string, keyof ErrorCodesMap>,
		ErrorBuilderInstance extends ReturnType<ReturnType<typeof errorBuilder<ErrorCodesMap, ErrorTranslationKeys>>>
	>({ errorBuilderInstance, errorTranslationKey }: {
		errorBuilderInstance: ErrorBuilderInstance,
		errorTranslationKey: Exclude<keyof ErrorTranslationKeys, number | symbol>,
	}, error: unknown, extraDetails?: Record<string, unknown>){
		if(error instanceof BaseError){
			const originalErrorMessage = error.cause instanceof Error ? error.cause.message : undefined
			error.extraDetails         = _.merge(error.extraDetails, extraDetails, { originalErrorMessage })
			return error
		}
		if(error && typeof error === 'object' && 'cause' in error && error.cause instanceof BaseError){
			const originalMessage    = 'message' in error ? error.message : undefined
			error.cause.extraDetails = _.merge(error.cause.extraDetails, extraDetails, { originalMessage })

			return error.cause
		}

		const originalMessage = error && typeof error === 'object' && 'message' in error ? error.message : undefined
		return errorBuilderInstance.BaseError(errorTranslationKey, { cause: error, extraDetails: { ...extraDetails, originalMessage } })
	}

	public addSystemProcessId(systemProcessId?: string){
		this.systemProcessId = systemProcessId ?? createId()
		return this
	}

	public async parseError(){
		this.userId = this.userId ?? await this.userIdGetter?.()
		return this
	}
}

export default BaseError
