import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import type { AppRouter } from "./src/root";
import { setDefaultHeadersInjector } from "@acme/message-broker"
import { auth } from "@acme/auth"
import { createCallerFactory } from "./src/trpc";
import { appRouter } from "./src/root";
import { createTRPCContext } from "./src/trpc";

/**
 * Create a server-side caller for the tRPC API
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
const createCaller = createCallerFactory(appRouter)
setDefaultHeadersInjector(async () => {
	const session = await auth()
	return {
		userID:     session.user?.sub,
		sentByUser: session.user?.sub ? "user" : "public"
	}
})

/**
 * Inference helpers for input types
 * @example type HelloInput = RouterInputs['example']['hello']
 **/
type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helpers for output types
 * @example type HelloOutput = RouterOutputs['example']['hello']
 **/
type RouterOutputs = inferRouterOutputs<AppRouter>;

export { createCaller, appRouter, createTRPCContext };

export type { AppRouter, RouterInputs, RouterOutputs }
