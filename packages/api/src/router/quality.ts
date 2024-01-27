import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc"
import { qualityValidations } from "@acme/validations"
import { getPaginationReturning } from "../apiHelpers"


export const qualityRouter = createTRPCRouter({
	list:
		protectedProcedure
		.input(z.object(qualityValidations.list))
		.query(async ({ ctx, input }) => {
			const { limit, search } = input
			const cursor            = input.cursor ?? "0"
			const items             = await ctx
			.dbHelper
			.query
			.qualities
			.list({ limit, search, cursor })
			.execute()
			return getPaginationReturning(items, limit ?? 20)
		})
})
