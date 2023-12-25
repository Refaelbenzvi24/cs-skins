import ServicesMap from "./servicesMap"
import errorCodesMap from "./errorCodesMap"


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
const errorSeverity = ["INFO", "WARNING", "ERROR", "CRITICAL"] as const

export interface ErrorOptions<ExtraDetails = undefined> {
	name?: string
	stack?: string
	message: string
	severity: typeof errorSeverity[number]
	code: keyof typeof errorCodesMap
	systemProcessId?: string
	initializedAtService: typeof ServicesMap[number]["name"]
	loggedAtService?: typeof ServicesMap[number]["name"]
	extraDetails?: ExtraDetails
	userId?: string
}


class BaseError<ExtraDetails = undefined> extends Error {
	public systemProcessId?: string
	public userId?: string
	public severity: typeof errorSeverity[number]
	public extraDetails?: ExtraDetails
	public initializedAtService: typeof ServicesMap[number]["name"]
	public loggedAtService: typeof ServicesMap[number]["name"]
	public code: keyof typeof errorCodesMap

	constructor(options: ErrorOptions<ExtraDetails>) {
		super (options.message);
		this.name = options.name ?? "BaseError"
		this.code = options.code
		this.message = options.message
		this.stack = this.stack ?? new Error ().stack
		this.userId = options.userId ?? "system"
		this.severity = options.severity
		this.systemProcessId = options.systemProcessId
		this.initializedAtService = options.initializedAtService
		this.loggedAtService = options.loggedAtService ?? process.env.npm_package_name as typeof ServicesMap[number]["name"]
		this.extraDetails = options.extraDetails
	}

	public parseError() {
		return {
			...this,
			stack: this.stack?.split ("\n").map (line => line.trim ()),
		}
	}

	public toString() {
		return JSON.stringify (this.parseError ())
	}
}

export default BaseError
