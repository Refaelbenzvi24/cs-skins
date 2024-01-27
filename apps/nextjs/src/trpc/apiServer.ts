import { cache } from "react";
import { headers } from "next/headers";

import { createCaller, createTRPCContext } from "@acme/api";
import { auth } from "@acme/auth";
import getEmailProvider from "~/utils/emailProvider"
import { messageBrokerConnectionParams } from "~/modules/vars"
import apm from "elastic-apm-node"


/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(async () => {
	const heads = new Headers(headers());
	heads.set("x-trpc-source", "rsc");

	return createTRPCContext({
		session: await auth(),
		headers: heads,
	}, {
		emailProvider: await getEmailProvider(),
		messageBrokerConnectionParams,
		apm
	});
});

export const trpcRsc = createCaller(createContext)


// createTRPCClient<typeof appRouter>({
// 	transformer: SuperJSON,
// 	links:       [
// 		loggerLink({
// 			enabled: (op) =>
// 				         process.env.NODE_ENV === "development" ||
// 				         (op.direction === "down" && op.result instanceof Error),
// 		}),
// 		/**
// 		 * Custom RSC link that invokes procedures directly in the server component Don't be too afraid
// 		 * about the complexity here, it's just wrapping `callProcedure` with an observable to make it a
// 		 * valid ending link for tRPC.
// 		 */
// 		() =>
// 			({ op }) =>
// 				observable((observer) => {
// 					void (async () => {
// 						const ctx = await createContext()
// 						try {
// 							const data = await callProcedure({
// 								procedures:  appRouter._def.procedures,
// 								path:        op.path,
// 								getRawInput: () => Promise.resolve(op.input),
// 								ctx,
// 								type:        op.type,
// 							});
// 							observer.next({ result: { data } });
// 							observer.complete();
// 						} catch (error) {
// 							const trpcError = TRPCError.from<
// 								typeof errorCodesMap,
// 								typeof errorTranslationKeys,
// 								typeof ctx.newError
// 							>({
// 								errorBuilderInstance: ctx.newError,
// 								errorTranslationKey:  "errors:authorizationError"
// 							}, error)
// 							const httpStatus = getHTTPStatusCodeFromError(trpcError);
// 							observer.error({
// 								stack: trpcError.stack,
// 								cause: trpcError.cause,
// 								name: trpcError.name,
// 								message: trpcError.message,
// 								shape: {
// 									code: TRPC_ERROR_CODES_BY_KEY[trpcError.code],
// 									message: trpcError.message,
// 									data: {
// 										stack: trpcError.stack,
// 										path: op.path,
// 										code: trpcError.code,
// 										zodError:  trpcError.cause instanceof ZodError ? trpcError.cause.flatten() : null,
// 										httpStatus
// 									}
// 								},
// 								data: {
// 									stack: trpcError.stack,
// 									path: op.path,
// 									code: trpcError.code,
// 									zodError:  trpcError.cause instanceof ZodError ? trpcError.cause.flatten() : null,
// 									httpStatus
// 								},
// 								meta: {
// 									httpStatus,
// 									code: trpcError.code,
// 									path: op.path,
// 									zodError:  trpcError.cause instanceof ZodError ? trpcError.cause.flatten() : null,
// 								}
// 							})
// 							await ctx.errorLogger.logError(error)
// 						}
// 					})();
// 				}),
// 	],
// });
