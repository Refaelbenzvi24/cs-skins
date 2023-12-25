import BaseError, { ErrorOptions } from "./BaseError"

interface ErrorParams {
	systemProcessId?: ErrorOptions["systemProcessId"]
	initializedAtService: ErrorOptions["initializedAtService"]
	loggedAtService?: ErrorOptions["loggedAtService"]
}


const errorCodesMap = {
	E00001: (details: ErrorParams) => new BaseError ({
		name:                 "UnknownError",
		message:              "Unknown error",
		code:                 "E00001",
		severity:             "ERROR",
		systemProcessId:      details.systemProcessId,
		initializedAtService: details.initializedAtService,
		loggedAtService:      details.loggedAtService,
	}),
}

export default errorCodesMap
