import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc"
import { skinValidations } from "@acme/validations"
import { dbOperators, schema } from "@acme/db"
import _ from "lodash"


export const sourceRouter = createTRPCRouter({
	list:
		protectedProcedure
		.input(z.object(skinValidations.list))
		.query(async ({ ctx, input }) => {
			const { sources }                 = schema
			const { gt, desc, like, or, and } = dbOperators

			const { limit, search } = input
			const cursor            = input.cursor ?? "0"
			const items             = await ctx
			.db
			.select()
			.from(sources)
			.orderBy(({ id }) => desc(id))
			.where((queryData) => and(
				gt(queryData.id, cursor),
				...(search ? [or(
					like(queryData.name, `${search}`),
					like(queryData.url, `${search}`)
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
