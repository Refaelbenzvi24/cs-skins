"use client";
import "react-toastify/dist/ReactToastify.css"
import { useState } from "react";
import { QueryClient, QueryClientProvider, QueryErrorResetBoundary } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
import { loggerLink, unstable_httpBatchStreamLink } from "@trpc/client";
import SuperJSON from "superjson";
import { api, getBaseUrl } from "~/trpc/api";
import { apm } from "@elastic/apm-rum"


export function TRPCReactProvider(props: {
	children: React.ReactNode;
	headersPromise: Promise<Headers>;
}){
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime:    5 * 1000,
						throwOnError: true
					},
				},
			}),
	);

	const [trpcClient] = useState(() =>
		api.createClient({
			links: [
				loggerLink({
					enabled: (op) =>
						         process.env.NODE_ENV === "development" ||
						         (op.direction === "down" && op.result instanceof Error),
				}),
				unstable_httpBatchStreamLink({
					transformer: SuperJSON,
					url:         getBaseUrl() + "/api/trpc",
					async headers(){
						const headers = new Headers();
						headers.set("x-trpc-source", "nextjs-react");
						// if(typeof window !== 'undefined'){
						// 	headers.set("transaction-trace-id", apm.getCurrentTransaction())
						// }

						return headers;
					},
				}),
			],
		}),
	);

	return (
		<QueryErrorResetBoundary>
			<QueryClientProvider client={queryClient}>
				<api.Provider client={trpcClient} queryClient={queryClient}>
					<ReactQueryStreamedHydration transformer={SuperJSON}>
						{props.children}
					</ReactQueryStreamedHydration>
					<ReactQueryDevtools initialIsOpen={false}/>
				</api.Provider>
			</QueryClientProvider>
		</QueryErrorResetBoundary>
	);
}
