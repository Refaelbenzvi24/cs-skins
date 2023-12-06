import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc"
import { userValidations } from "@acme/validations"
import { getPaginationReturning } from "../apiHelpers"


export const userRouter = createTRPCRouter({
	list:
		protectedProcedure
		.input(z.object(userValidations.list))
		.query(async ({ ctx, input }) => {
			const { limit, search } = input
			const cursor            = input.cursor ?? "0"
			const items             = await ctx
			.dbHelper
			.query
			.users
			.list({ limit, search, cursor })
			.execute()

			return getPaginationReturning(items, limit ?? 20)
		})
})
