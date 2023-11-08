import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc"
import { qualityValidations } from "@acme/validations"
import { dbOperators, schema } from "@acme/db"
import _ from "lodash"


export const qualityRouter = createTRPCRouter({
	list:
		protectedProcedure
		.input(z.object(qualityValidations.list))
		.query(async ({ ctx, input }) => {
			const { qualities }               = schema
			const { gt, desc, like, or, and } = dbOperators

			const { limit, search } = input
			const cursor                   = input.cursor ?? "0"
			const items                    = await ctx
			.db
			.select()
			.from(qualities)
			.orderBy(({ id }) => desc(id))
			.where((queryData) => and(
				gt(queryData.id, cursor),
				...(search ? [like(queryData.name, `${search}`)] : [])
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
