import logger, { buildErrorCodesMapObject } from "./src"

const errorCodesMap = {
	E00001: buildErrorCodesMapObject({ severity: "ERROR", name: "UnknownError" }),
} as const


const errorTranslationKeys = {
	"errors:tests.error.test":                                  "E00001",
} satisfies Record<string, keyof typeof errorCodesMap>

export const newError = logger.errorBuilder(errorCodesMap, errorTranslationKeys)({
	initializedAtService: "scraper",
	loggedAtService: "scraper",
})


const playground = () => {
	const error = newError.TRPCError("errors:tests.error.test", "UNAUTHORIZED")
	console.log (error)
}

playground ()
