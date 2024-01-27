import errors from "./Errors"
import servicesMap from "./servicesMap"
import errorBuilder from "./errorBuilder"
import createInstance from "./createInstance"

const logger = {
	errors,
	servicesMap,
	errorBuilder,
	createInstance
}

export {default as errors} from "./Errors"

export { buildErrorCodesMapObject } from "./errorCodesMap"
export default logger
