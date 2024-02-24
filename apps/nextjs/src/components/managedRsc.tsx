import type { MaybePromise } from "@acme/logger/types"
import TRPCError from "@acme/logger/src/Errors/TRPCError"
import ErrorPage from "~/components/ErrorPage"
import type { errorCodesMap } from "@acme/api/src/services/logger";
import { loggerInstance } from "@acme/api/src/services/logger"
import type { errorTranslationKeys } from "@acme/api/src/services/logger/errorTranslationKeys"
import RscAsyncStorage from "~/modules/RscAsyncStorage"


const managedRsc = <ComponentProps extends unknown[]>(rsc: (...props: ComponentProps) => MaybePromise<JSX.Element>) => async (...props: ComponentProps) => {
	const apm = await import("elastic-apm-node")
	return RscAsyncStorage.run({}, async () => {
		try {
			return await rsc(...props)
		} catch (error) {
			const trpcError = TRPCError.from<
				typeof errorCodesMap,
				typeof errorTranslationKeys,
				typeof loggerInstance.errorBuilder
			>({ errorBuilderInstance: loggerInstance.errorBuilder, errorTranslationKey: "errors:unknown" }, error)
			apm.captureError(trpcError, {
				tags: {
					severity:  trpcError.severity,
					type:      trpcError.type,
					subType:   trpcError.subType,
					code:      trpcError.code,
					errorCode: trpcError.errorCode,
					extra:     trpcError.extraDetails
				}
			})
			return ErrorPage({ errorCode: trpcError.errorCode, errorId: trpcError.errorId, code: trpcError.code, message: trpcError.message, timestamp: trpcError.timestamp })
		}
	})
}

export default managedRsc
