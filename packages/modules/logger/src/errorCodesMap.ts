import { ErrorNameOptions, errorNames, ErrorOptions } from "./Errors/BaseError"
import { MaybePromise } from "../types"


export interface ErrorParams {
	initializedAtService: ErrorOptions["initializedAtService"]
	loggedAtService?: ErrorOptions["loggedAtService"]
	userIdGetter?: () => MaybePromise<ErrorOptions["userId"]>
}

export interface ErrorCodesMapObject<ErrorName extends ErrorNameOptions> extends Pick<ErrorOptions, 'severity'> {
	name: ErrorName
	subName?: typeof errorNames[ErrorName][number]
}

export const buildErrorCodesMapObject = <ErrorName extends ErrorNameOptions>(error: Omit<ErrorCodesMapObject<ErrorName>, 'initializedAtService' | 'loggedAtService'>) => (details: ErrorParams) => {
	const { initializedAtService, loggedAtService } = details
	return {
		initializedAtService,
		loggedAtService,
		...error
	} satisfies ErrorOptions
}


const errorCodesMap = {
	E00001: buildErrorCodesMapObject({ severity: "ERROR", name: "UnknownError" }),
	E00002: buildErrorCodesMapObject({ severity: "ERROR", name: "ValidationError" }),
	E00003: buildErrorCodesMapObject({ severity: "ERROR", name: "AuthenticationError" }),
	E00004: buildErrorCodesMapObject({ severity: "ERROR", name: "AuthorizationError" }),
	E00005: buildErrorCodesMapObject({ severity: "ERROR", name: "DatabaseError" }),
	E00006: buildErrorCodesMapObject({ severity: "ERROR", name: "PermissionError" })
} as const

export default errorCodesMap
