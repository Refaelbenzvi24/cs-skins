import type { MaybePromise } from "@acme/logger/types"
import TRPCError from "@acme/logger/src/Errors/TRPCError"
import ErrorPage from "~/components/ErrorPage"
import type { TRPCErrorWithGenerics } from "@acme/api/src/trpc"
import type { errorCodesMap } from "@acme/api/src/services/logger";
import { loggerInstance } from "@acme/api/src/services/logger"
import type { errorTranslationKeys } from "@acme/api/src/services/logger/errorTranslationKeys"
import apm from "elastic-apm-node"
import RscAsyncStorage from "~/modules/RscAsyncStorage"


const managedRsc = <ComponentProps extends unknown[]>(rsc: (...props: ComponentProps) => MaybePromise<JSX.Element>) => async (...props: ComponentProps) => {
	return RscAsyncStorage.run({}, async () => {
		try {
			return await rsc(...props)
		} catch (error) {
			// TODO: consider moving it from here
			// TODO: check if this is needed after the error is captured at trpc
			if(error instanceof Error && error.cause instanceof TRPCError){
				const cause = error.cause as TRPCErrorWithGenerics
				// apm.captureError(cause)
				return ErrorPage({ ...cause })
			}
			const trpcError = TRPCError.from<
				typeof errorCodesMap,
				typeof errorTranslationKeys,
				typeof loggerInstance.errorBuilder
			>({ errorBuilderInstance: loggerInstance.errorBuilder, errorTranslationKey: "errors:unknown" }, error)
			apm.captureError(trpcError)
			return ErrorPage({ errorCode: trpcError.code, errorId: trpcError.errorId, code: trpcError.code, message: trpcError.message, timestamp: trpcError.timestamp })
		}
	})
}

export default managedRsc
