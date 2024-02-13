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
		apm,
		isServer: true
	});
});

export const trpcRsc = createCaller(createContext)
