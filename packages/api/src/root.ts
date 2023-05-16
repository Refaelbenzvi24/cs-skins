import {authRouter} from "./router/auth"
import {createTRPCRouter} from "./trpc"
import {leadsRouter} from "./router/leads"

export const appRouter = createTRPCRouter({
	leads: leadsRouter,
	auth: authRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
