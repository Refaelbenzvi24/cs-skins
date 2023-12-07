import {appRouter, createTRPCContext } from "@acme/api";
import superjson from "superjson";
import { createTRPCNextLayout } from "@trpc/next-layout/server";
import { messageBrokerConnectionParams } from "~/modules/vars"
import {auth} from "@acme/auth"
import getEmailProvider from "~/utils/emailProvider"
import "server-only";

export const trpcRsc = createTRPCNextLayout({
	router: appRouter,
	transformer: superjson,
	createContext: async () => {
		return createTRPCContext({ auth: await auth(), req: (null as unknown as Request) }, { messageBrokerConnectionParams, emailProvider: await getEmailProvider() })
	},
});
