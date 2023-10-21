import { authRouter } from "./router/auth"
import { skinRouter } from "./router/skin"
import { postRouter } from "./router/post"
import { createTRPCRouter } from "./trpc"

export const appRouter = createTRPCRouter ({
	skin: skinRouter,
	auth: authRouter,
	post: postRouter
})

// export type definition of API
export type AppRouter = typeof appRouter
