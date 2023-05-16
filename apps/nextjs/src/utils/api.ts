import {httpBatchLink, loggerLink} from "@trpc/client"
import {createTRPCNext} from "@trpc/next"
import {type inferRouterInputs, type inferRouterOutputs} from "@trpc/server"
import type {AppRouter} from "@acme/api"
import {transformer} from "@acme/api/transformer"

const getBaseUrl = () => {
	if (typeof window !== "undefined") return ""; // browser should use relative url
	if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
	
	return `http://localhost:3000`; // dev SSR should use localhost
}

export const api = createTRPCNext<AppRouter>({
	config({ctx}) {
		return {
			headers: () => {
				if (ctx?.req) {
					// To use SSR properly, you need to forward the client's headers to the server
					const headers = ctx?.req?.headers;
					// If you're using Node 18, delete the "connection" header
					delete headers?.connection;
					return {
						...headers,
						// optional - inform server that it's an ssr request
						'x-ssr': '1',
					};
				}
				return {};
			},
			transformer,
			links: [
				loggerLink({
					enabled: (opts) =>
						process.env.NODE_ENV === "development" ||
						(opts.direction === "down" && opts.result instanceof Error),
				}),
				httpBatchLink({
					url: `${getBaseUrl()}/api/trpc`,
				}),
			],
		};
	},
	ssr: false,
});

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
