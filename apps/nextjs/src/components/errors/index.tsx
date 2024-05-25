import type { TRPC_ERROR_CODE_KEY } from "@acme/logger/src/Errors/TRPCError";
import type { errorTranslationKeys } from "@acme/api/src/services/logger/errorTranslationKeys"
import type { MaybePromise } from "@acme/logger/types"
import NotFound from "./NotFound"
import BadRequest from "./BadRequest"
import InternalServerError from "~/components/errors/InternalServerError"
import Unauthorized from "~/components/errors/Unauthorized"
import Forbidden from "~/components/errors/Forbidden"
import type { ErrorInfoProps } from "~/components/errors/ErrorInfo"

export interface ErrorComponentProps extends ErrorInfoProps {
	message: keyof typeof errorTranslationKeys
	code: TRPC_ERROR_CODE_KEY
}

// TODO: maybe move this to the ui package?
const errorCodesComponentsMap = {
	NOT_FOUND:             NotFound,
	BAD_REQUEST:           BadRequest,
	INTERNAL_SERVER_ERROR: InternalServerError,
	NOT_IMPLEMENTED:       InternalServerError,
	UNAUTHORIZED:          Unauthorized,
	FORBIDDEN:             Forbidden,
	METHOD_NOT_SUPPORTED:  InternalServerError,
	TIMEOUT:               InternalServerError,
	CONFLICT:              InternalServerError,
	PRECONDITION_FAILED:   InternalServerError,
	PAYLOAD_TOO_LARGE:     InternalServerError,
	UNPROCESSABLE_CONTENT: InternalServerError,
	TOO_MANY_REQUESTS:     InternalServerError,
	CLIENT_CLOSED_REQUEST: InternalServerError,
	PARSE_ERROR:           InternalServerError
} as const satisfies Record<TRPC_ERROR_CODE_KEY, (errorComponentProps: ErrorComponentProps) => MaybePromise<JSX.Element>>

export default errorCodesComponentsMap
