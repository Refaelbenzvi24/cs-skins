import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc"
import { skinValidations } from "@acme/validations"
import { getPaginationReturning } from "../apiHelpers"


export const sourceRouter = createTRPCRouter({
	list:
		protectedProcedure
		.input(z.object(skinValidations.list))
		.query(async ({ ctx, input }) => {
			const { limit, search } = input
			const cursor            = input.cursor ?? "0"
			const items             = await ctx
			.dbHelper
			.query
			.sources
			.list({ limit, search, cursor })
			.execute()

			return getPaginationReturning(items, limit ?? 20)
		})
})
