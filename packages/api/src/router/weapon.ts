import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc"
import { weaponValidations } from "@acme/validations"
import { getPaginationReturning } from "../apiHelpers"


export const weaponRouter = createTRPCRouter({
	list:
		protectedProcedure
		.input(z.object(weaponValidations.list))
		.query(async ({ ctx, input }) => {
			const { limit, search } = input
			const cursor            = input.cursor ?? "0"
			throw ctx.newError.TRPCError("errors:weapons.list.notFound", "NOT_FOUND")
			const items = await ctx
			.dbHelper
			.query
			.weapons
			.list({ limit, search, cursor })
			.execute()

			return getPaginationReturning(items, limit ?? 20)
		})
})
