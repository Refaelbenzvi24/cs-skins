import type { MaybePromise } from "@acme/logger/types"
import TRPCError from "@acme/logger/src/Errors/TRPCError"
import ErrorPage from "~/components/ErrorPage"
import type { TRPCErrorWithGenerics } from "@acme/api/src/trpc"
import type { errorCodesMap } from "@acme/api/src/services/logger";
import { loggerInstance } from "@acme/api/src/services/logger"
import type { errorTranslationKeys } from "@acme/api/src/services/logger/errorTranslationKeys"
// import apm from "elastic-apm-node"
// import { headers } from "next/headers"


const managedRsc = <ComponentProps extends unknown[]>(rsc: (...props: ComponentProps) => MaybePromise<JSX.Element>) => async (...props: ComponentProps) => {
	try {
		// const currentHeaders = new Headers(headers())
		// console.log({ path: currentHeaders.get('x-pathname') })
		// apm.startTransaction(`GET: ${currentHeaders.get('x-pathname')}`)
		// console.log({ currentHeaders })
		// console.log({ currentTransaction: apm.currentTransaction })
		return await rsc(...props)
	} catch (error) {
		if(error && typeof error === 'object' && 'cause' in error && error.cause instanceof TRPCError){
			const cause = error.cause as TRPCErrorWithGenerics
			return ErrorPage({ ...cause })
		}
		const trpcError = TRPCError.from<
			typeof errorCodesMap,
			typeof errorTranslationKeys,
			typeof loggerInstance.errorBuilder
		>({ errorBuilderInstance: loggerInstance.errorBuilder, errorTranslationKey: "errors:unknownError" }, error)
		return ErrorPage({ errorCode: trpcError.code, errorId: trpcError.errorId, code: trpcError.code, message: trpcError.message, timestamp: trpcError.timestamp })
	}
}

export default managedRsc
