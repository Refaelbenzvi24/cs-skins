import { ErrorOptions } from "./Errors/BaseError"

export interface ErrorParams {
	initializedAtService: ErrorOptions["initializedAtService"]
	loggedAtService?: ErrorOptions["loggedAtService"]
}


const errorCodesMap = {
	E00001: (details: ErrorParams) => ({
		name:                 "UnknownError",
		message:              "Unknown error",
		errorCode:            "E00001",
		severity:             "ERROR",
		...details
	} satisfies ErrorOptions),
	E00002: (details: ErrorParams) => ({
		name:                 "ValidationError",
		message:              "Validation error",
		errorCode:            "E00002",
		severity:             "ERROR",
		...details
	} satisfies ErrorOptions),
	E00003: (details: ErrorParams) => ({
		name:                 "AuthenticationError",
		message:              "Authentication error",
		errorCode:            "E00003",
		severity:             "ERROR",
		...details
	} satisfies ErrorOptions),
	E00004: (details: ErrorParams) => ({
		name:                 "AuthorizationError",
		message:              "Authorization error",
		errorCode:            "E00004",
		severity:             "ERROR",
		...details
	} satisfies ErrorOptions),
	E00005: (details: ErrorParams) => ({
		name:                 "DatabaseError",
		message:              "Database error",
		errorCode:            "E00005",
		severity:             "ERROR",
		...details
	} satisfies ErrorOptions),
	E00006: (details: ErrorParams) => ({
		name:                 "PermissionError",
		message:              "Permission error",
		errorCode:            "E00006",
		severity:             "ERROR",
		...details
	} satisfies ErrorOptions),
}

export default errorCodesMap
