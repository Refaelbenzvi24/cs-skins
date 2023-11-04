import { createTRPCReact } from "@trpc/react-query";

import type { AppRouter } from "@acme/api";
import { loggerLink, unstable_httpBatchStreamLink } from "@trpc/client"
import { env } from "~/env.mjs"

export const getBaseUrl = () => {
	if (typeof window !== "undefined") return ""; // browser should use relative url
	if (env.VERCEL_URL) return env.VERCEL_URL; // SSR should use vercel url

	return `http://localhost:${env.PORT}`; // dev SSR should use localhost
};

export const getTRPCLinks = () => [
	loggerLink ({
		enabled: (opts) =>
			         process.env.NODE_ENV === "development" ||
			         (opts.direction === "down" && opts.result instanceof Error),
	}),
	unstable_httpBatchStreamLink ({
		url: `${getBaseUrl ()}/api/trpc`,
		headers() {
			const headers = new Map (props.headers);
			headers.set ("x-trpc-source", "nextjs-react");
			return Object.fromEntries (headers);
		},
	}),
];

export const api = createTRPCReact<AppRouter>();

export { type RouterInputs, type RouterOutputs } from "@acme/api";
