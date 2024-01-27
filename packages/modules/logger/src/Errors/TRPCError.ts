import { buildErrorCodesMapObject } from "../errorCodesMap"
import BaseError, { ErrorNameOptions, ErrorOptionsWithGenerics } from "./BaseError"
import errorBuilder from "../errorBuilder"


type KeyFromValue<TValue, TType extends Record<PropertyKey, PropertyKey>> = {
	[K in keyof TType]: TValue extends TType[K] ? K : never;
}[keyof TType];

type Invert<TType extends Record<PropertyKey, PropertyKey>> = {
	[TValue in TType[keyof TType]]: KeyFromValue<TValue, TType>;
};

/**
 * @internal
 */
export function invert<TRecord extends Record<PropertyKey, PropertyKey>>(
	obj: TRecord,
): Invert<TRecord>{
	const newObj = Object.create(null);
	for (const key in obj) {
		const v   = obj[key];
		newObj[v] = key;
	}
	return newObj;
}

/**
 * JSON-RPC 2.0 Error codes
 *
 * `-32000` to `-32099` are reserved for implementation-defined server-errors.
 * For tRPC we're copying the last digits of HTTP 4XX errors.
 */
export const TRPC_ERROR_CODES_BY_KEY = {
	/**
	 * Invalid JSON was received by the server.
	 * An error occurred on the server while parsing the JSON text.
	 */
	PARSE_ERROR: -32700,
	/**
	 * The JSON sent is not a valid Request object.
	 */
	BAD_REQUEST: -32600, // 400

	// Internal JSON-RPC error
	INTERNAL_SERVER_ERROR: -32603,
	NOT_IMPLEMENTED:       -32603,

	// Implementation specific errors
	UNAUTHORIZED:          -32001, // 401
	FORBIDDEN:             -32003, // 403
	NOT_FOUND:             -32004, // 404
	METHOD_NOT_SUPPORTED:  -32005, // 405
	TIMEOUT:               -32008, // 408
	CONFLICT:              -32009, // 409
	PRECONDITION_FAILED:   -32012, // 412
	PAYLOAD_TOO_LARGE:     -32013, // 413
	UNPROCESSABLE_CONTENT: -32022, // 422
	TOO_MANY_REQUESTS:     -32029, // 429
	CLIENT_CLOSED_REQUEST: -32099, // 499
} as const;

export const TRPC_ERROR_CODES_BY_NUMBER = invert(TRPC_ERROR_CODES_BY_KEY);
type ValueOf<TObj> = TObj[keyof TObj];

export type TRPC_ERROR_CODE_NUMBER = ValueOf<typeof TRPC_ERROR_CODES_BY_KEY>;
export type TRPC_ERROR_CODE_KEY = keyof typeof TRPC_ERROR_CODES_BY_KEY;

export interface TRPCErrorOptions {
	code: TRPC_ERROR_CODE_KEY;
}

export interface TRPCErrorOptionsWithGenerics<
	ErrorCodesMap extends Record<string, ReturnType<typeof buildErrorCodesMapObject>>,
	ErrorTranslationKeys extends Record<`errors:${string}`, keyof ErrorCodesMap>,
	ErrorMessage extends keyof Pick<ErrorTranslationKeys, `errors:${string}`>,
	ErrorName extends ErrorNameOptions,
	ErrorCode extends keyof ErrorCodesMap,
	ExtraDetails = undefined
> extends ErrorOptionsWithGenerics<ErrorCodesMap, ErrorTranslationKeys, ErrorMessage, ErrorName, ErrorCode, ExtraDetails>, TRPCErrorOptions {
}

class TRPCError<
	ErrorCodesMap extends Record<string, ReturnType<typeof buildErrorCodesMapObject>>,
	ErrorTranslationKeys extends Record<`errors:${string}`, keyof ErrorCodesMap>,
	ErrorMessage extends keyof Pick<ErrorTranslationKeys, `errors:${string}`>,
	ErrorName extends ErrorNameOptions,
	ErrorCode extends keyof ErrorCodesMap,
	ExtraDetails = undefined
> extends BaseError<ErrorCodesMap, ErrorTranslationKeys, ErrorMessage, ErrorName, ErrorCode, ExtraDetails> {
	public readonly cause?: Error;
	public readonly code: TRPC_ERROR_CODE_KEY;

	constructor(options: TRPCErrorOptionsWithGenerics<ErrorCodesMap, ErrorTranslationKeys, ErrorMessage, ErrorName, ErrorCode, ExtraDetails>){
		super(options);
		this.code = options.code;
	}

	public static from<
		ErrorCodesMap extends Record<string, ReturnType<typeof buildErrorCodesMapObject>>,
		ErrorTranslationKeys extends Record<`errors:${string}`, keyof ErrorCodesMap>,
		ErrorBuilderInstance extends ReturnType<ReturnType<typeof errorBuilder<ErrorCodesMap, ErrorTranslationKeys>>>
	>({ errorBuilderInstance, errorTranslationKey }: {
		errorBuilderInstance: ErrorBuilderInstance,
		errorTranslationKey: keyof ErrorTranslationKeys,
	}, error: unknown) {
		if(error instanceof TRPCError){
			return error
		}

		return errorBuilderInstance.TRPCError(errorTranslationKey, "INTERNAL_SERVER_ERROR", { cause: error, extraDetails: { originalError: error } })
	}
}

export default TRPCError
