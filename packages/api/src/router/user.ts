import { z } from "zod";

import { createTRPCRouter, protectedProcedure, protectedProcedureWithPermissions } from "../trpc"
import { userValidations } from "@acme/validations"
import { getPaginationReturning } from "../apiHelpers"
import { hashPassword } from "@acme/auth"


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
		}),
	create:
		protectedProcedureWithPermissions(["admin"])
		.input(z.object(userValidations.create))
		.mutation(async ({ ctx, input }) => {
			const { email, password, name } = input
			const hashedPassword            = hashPassword(password)
			return await ctx
			.dbHelper
			.mutate
			.users
			.insert({ data: { email, password: hashedPassword, name } })
			.execute()
		}),
})
