import { ErrorNameOptions, errorNames, ErrorOptions } from "./Errors/BaseError"
import { MaybePromise } from "../types"


export interface ErrorParams {
	userIdGetter?: () => MaybePromise<ErrorOptions["userId"]>
}

export interface ErrorCodesMapObject<ErrorName extends ErrorNameOptions> extends Pick<ErrorOptions, 'severity'> {
	type: ErrorName
	subName?: typeof errorNames[ErrorName][number]
}

export const buildErrorCodesMapObject = <ErrorName extends ErrorNameOptions>(error: Omit<ErrorCodesMapObject<ErrorName>, 'initializedAtService' | 'loggedAtService'>) => (details: ErrorParams) => {
	return { ...error } satisfies ErrorOptions
}


const errorCodesMap = {
	E00001: buildErrorCodesMapObject({ severity: "ERROR", type: "UnknownError" }),
	E00002: buildErrorCodesMapObject({ severity: "ERROR", type: "ValidationError" }),
	E00003: buildErrorCodesMapObject({ severity: "ERROR", type: "AuthenticationError" }),
	E00004: buildErrorCodesMapObject({ severity: "ERROR", type: "AuthorizationError" }),
	E00005: buildErrorCodesMapObject({ severity: "ERROR", type: "DatabaseError" }),
	E00006: buildErrorCodesMapObject({ severity: "ERROR", type: "PermissionError" })
} as const

export default errorCodesMap
