import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import type { AppRouter } from "./src/root";
import { setDefaultHeadersInjector } from "@acme/message-broker"
import { auth } from "@acme/auth"


setDefaultHeadersInjector(async () => {
	const session = await auth()
	return {
		userID:     session.user?.id,
		sentByUser: session.user?.id ? "user" : "public"
	}
})

export { appRouter, type AppRouter } from "./src/root";
export { createTRPCContext } from "./src/trpc";

/**
 * Inference helpers for input types
 * @example type HelloInput = RouterInputs['example']['hello']
 **/
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helpers for output types
 * @example type HelloOutput = RouterOutputs['example']['hello']
 **/
export type RouterOutputs = inferRouterOutputs<AppRouter>;
