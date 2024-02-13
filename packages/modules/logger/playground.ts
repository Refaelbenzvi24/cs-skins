import logger, { buildErrorCodesMapObject } from "./src"
import BaseError from "./src/Errors/BaseError"

const errorCodesMap = {
	E00001: buildErrorCodesMapObject({ severity: "ERROR", type: "UnknownError" }),
} as const


const errorTranslationKeys = {
	"errors:tests.error.test":                                  "E00001",
} satisfies Record<string, keyof typeof errorCodesMap>

export const newError = logger.errorBuilder(errorCodesMap, errorTranslationKeys)({
	initializedAtService: "scraper",
	loggedAtService: "scraper",
})


const playground = () => {
	const error = newError.BaseError("errors:tests.error.test")
	const error2 = newError.TRPCError("errors:tests.error.test", "UNAUTHORIZED")
}

playground ()
