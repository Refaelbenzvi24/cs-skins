import ServicesMap from "../servicesMap"
import errorCodesMap from "../errorCodesMap"
import { createId } from "@paralleldrive/cuid2"

class UnknownCauseError extends Error {
	[key: string]: unknown;
}
export function isObject(value: unknown): value is Record<string, unknown> {
	// check that value is object
	return !!value && !Array.isArray(value) && typeof value === 'object';
}

function getCauseFromUnknown(cause: unknown): Error | undefined {
	if (cause instanceof Error) {
		return cause;
	}

	const type = typeof cause;
	if (type === 'undefined' || type === 'function' || cause === null) {
		return undefined;
	}

	// Primitive types just get wrapped in an error
	if (type !== 'object') {
		return new Error(String(cause));
	}

	// If it's an object, we'll create a synthetic error
	if (isObject(cause)) {
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

export interface ErrorOptions<ExtraDetails = undefined> {
	name?: string
	stack?: string
	message: string
	severity: typeof errorSeverity[number]
	errorCode: keyof typeof errorCodesMap
	initializedAtService: typeof ServicesMap[number]["name"]
	loggedAtService?: typeof ServicesMap[number]["name"]
	extraDetails?: ExtraDetails
	userId?: string
	cause?: unknown;
}


class BaseError<ExtraDetails = undefined> extends Error {
	public systemProcessId?: string
	public userId?: string
	public severity: typeof errorSeverity[number]
	public extraDetails?: ExtraDetails
	public initializedAtService: typeof ServicesMap[number]["name"]
	public loggedAtService: typeof ServicesMap[number]["name"]
	public errorCode: keyof typeof errorCodesMap

	constructor(options: ErrorOptions<ExtraDetails>){
		const cause   = getCauseFromUnknown(options.cause);
		const message = options.message ?? cause?.message;

		super(message, { cause });
		super(options.message, { cause });
		this.name                 = options.name ?? "BaseError"
		this.errorCode            = options.errorCode
		this.message              = options.message
		this.stack                = this.stack ?? new Error().stack
		this.userId               = options.userId ?? "system"
		this.severity             = options.severity
		this.systemProcessId      = createId()
		this.initializedAtService = options.initializedAtService
		this.loggedAtService      = options.loggedAtService ?? process.env.npm_package_name as typeof ServicesMap[number]["name"]
		this.extraDetails         = options.extraDetails

		if(!this.cause){
			// idk why this is needed, but it is
			this.cause = cause;
		}
	}

	public parseError(){
		return {
			...this,
			stack: this.stack?.split("\n").map(line => line.trim()),
		}
	}

	public toString(){
		return JSON.stringify(this.parseError())
	}
}

export default BaseError
