import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc"
import { userValidations } from "@acme/validations"
import { dbOperators, schema } from "@acme/db"
import _ from "lodash"


export const userRouter = createTRPCRouter({
	list:
		protectedProcedure
		.input(z.object(userValidations.list))
		.query(async ({ ctx, input }) => {
			const { users }                   = schema
			const { gt, desc, like, or, and } = dbOperators

			const { limit, search } = input
			const cursor            = input.cursor ?? "0"
			const items             = await ctx
			.db
			.select({
				id:    users.id,
				name:  users.name,
				email: users.email
			})
			.from(users)
			.orderBy(({ id }) => desc(id))
			.where((queryData) => and(
				gt(queryData.id, cursor),
				...(search ? [or(
					like(queryData.name, `${search}`),
					like(queryData.email, `${search}`),
				)] : [])
			))
			.limit(limit ?? 20)
			.execute()

			if(items.length !== limit){
				return {
					items,
					nextCursor: null
				}
			}

			return {
				items,
				nextCursor: items.length > 0 ? _.last(items)!.id : null
			};
		})
})
