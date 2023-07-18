import {authRouter} from "./router/auth"
import {createTRPCRouter} from "./trpc"
import {skinRouter} from "./router/skin"

export const appRouter = createTRPCRouter({
	skin: skinRouter,
	auth: authRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
