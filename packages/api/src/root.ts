import { authRouter } from "./router/auth"
import { skinDataRouter } from "./router/skinData"
import { postRouter } from "./router/post"
import { createTRPCRouter } from "./trpc"
import { skinRouter } from "./router/skin"
import { sourceRouter } from "./router/source"
import { weaponRouter } from "./router/weapon"
import { qualityRouter } from "./router/quality"
import { userRouter } from "./router/user"

export const appRouter = createTRPCRouter ({
	source: sourceRouter,
	weapon: weaponRouter,
	skin: skinRouter,
	skinData: skinDataRouter,
	quality: qualityRouter,
	auth: authRouter,
	post: postRouter,
	user: userRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
