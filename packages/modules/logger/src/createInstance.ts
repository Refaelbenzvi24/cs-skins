import { buildErrorCodesMapObject, ErrorParams } from "./errorCodesMap"
import errorBuilder from "./errorBuilder"
import logger from "./logger"


const createInstance = <
	ErrorCodesMap extends Record<string, ReturnType<typeof buildErrorCodesMapObject>>,
	ErrorTranslationKeys extends Record<string, keyof ErrorCodesMap>
>(errorCodesMap: ErrorCodesMap, errorTranslationKeys: ErrorTranslationKeys) => (details: ErrorParams) => {
	const errorBuilderInstance = errorBuilder(errorCodesMap, errorTranslationKeys)(details)
	return {
		errorBuilder: errorBuilderInstance,
		logger: logger(errorBuilderInstance),
	}
}

export default createInstance
