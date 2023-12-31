import BaseError from "./Errors/BaseError"
import TRPCError from "./Errors/TRPCError"
import errorCodesMap, { ErrorParams } from "./errorCodesMap"


const errors = {
	BaseError,
	TRPCError
}

import servicesMap from "./servicesMap"


const errorBuilder = (details: ErrorParams) => ({
	BaseError: (error: keyof typeof errorCodesMap) => new BaseError(errorCodesMap[error](details)),
	TRPCError: (error: keyof typeof errorCodesMap, code: TRPCError['code']) => new TRPCError({
		...errorCodesMap[error](details),
		code
	})
})

export default {
	errors,
	errorCodesMap,
	servicesMap,
	errorBuilder
}
