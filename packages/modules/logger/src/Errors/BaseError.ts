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
	"DatabaseError":       ["QueryFailed"],
	"PermissionError":     [],
	"MessageBroker":       ["Connection", "ChannelCreation", "SendingMessage", "AssertingQueue", "MessageConsuming", "PurgingQueue"]
} as const

export type ErrorNameOptions = keyof typeof errorNames

export interface ErrorOptions {
	severity: typeof errorSeverity[number]
	addSystemProcessId?: boolean
	initializedAtService: typeof ServicesMap[number]["name"]
	loggedAtService?: typeof ServicesMap[number]["name"]
	userId?: string
	userIdGetter?: () => MaybePromise<string>
	cause?: unknown;
}

export interface ErrorOptionsWithGenerics<
	ErrorCodesMap extends Record<string, ReturnType<typeof buildErrorCodesMapObject>>,
	ErrorTranslationKeys extends Record<`errors:${string}`, keyof ErrorCodesMap>,
	ErrorMessage extends keyof ErrorTranslationKeys,
	ErrorName extends ErrorNameOptions,
	ErrorCode extends keyof ErrorCodesMap,
	ExtraDetails = undefined
> extends ErrorOptions {
	type: ErrorName
	subType?: typeof errorNames[ErrorName][number]
	message: ErrorMessage
	errorCode: ErrorCode
	extraDetails?: ExtraDetails
}

class BaseError<
	ErrorCodesMap extends Record<string, ReturnType<typeof buildErrorCodesMapObject>>,
	ErrorTranslationKeys extends Record<`errors:${string}`, keyof ErrorCodesMap>,
	ErrorMessage extends keyof Pick<ErrorTranslationKeys, `errors:${string}`>,
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
	public initializedAtService: typeof ServicesMap[number]["name"]
	public loggedAtService: typeof ServicesMap[number]["name"]
	public errorCode: ErrorCode
	public message: ErrorMessage
	public timestamp: string

	constructor(options: ErrorOptionsWithGenerics<ErrorCodesMap, ErrorTranslationKeys, ErrorMessage, ErrorName, ErrorCode, ExtraDetails>){
		const cause   = getCauseFromUnknown(options.cause);
		const message = options.message ?? cause?.message;

		super(message, { cause });
		this.errorId              = createId()
		this.type                 = options.type
		this.subType              = options.subType
		this.errorCode            = options.errorCode
		this.message              = options.message
		this.userId               = options.userId ?? "system"
		this.severity             = options.severity
		this.initializedAtService = options.initializedAtService
		this.loggedAtService      = options.loggedAtService ?? process.env.npm_package_name as typeof ServicesMap[number]["name"]
		this.extraDetails         = options.extraDetails
		this.userIdGetter         = options.userIdGetter
		this.timestamp            = new Date().toISOString()

		if(!this.cause){
			// idk why this is needed, but it is
			this.cause = cause;
		}
	}

	public static from<
		ErrorCodesMap extends Record<string, ReturnType<typeof buildErrorCodesMapObject>>,
		ErrorTranslationKeys extends Record<`errors:${string}`, keyof ErrorCodesMap>,
		ErrorBuilderInstance extends ReturnType<ReturnType<typeof errorBuilder<ErrorCodesMap, ErrorTranslationKeys>>>
	>({ errorBuilderInstance, errorTranslationKey }: {
		errorBuilderInstance: ErrorBuilderInstance,
		errorTranslationKey: keyof ErrorTranslationKeys,
	}, error: unknown, extraDetails?: Record<string, unknown>) {
		if(error instanceof BaseError){
			return {
				...error,
				extraDetails: _.merge(error.extraDetails, extraDetails)
			}
		}

		return errorBuilderInstance.BaseError(errorTranslationKey, { cause: error, extraDetails: { originalError: error, extraDetails } })
	}
	public addSystemProcessId(systemProcessId?: string){
		this.systemProcessId = systemProcessId ?? createId()
		return this
	}

	public async parseError(){
		this.userId = this.userId ?? await this.userIdGetter?.()
		return {
			...this,
			stack: this.stack?.split("\n").map(line => line.trim()),
		}
	}

	public async toString(){
		return JSON.stringify(await this.parseError())
	}
}

export default BaseError
