import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc"
import { weaponValidations } from "@acme/validations"
import { dbOperators, schema } from "@acme/db"
import _ from "lodash"


export const weaponRouter = createTRPCRouter ({
	list:
		protectedProcedure
			.input (z.object (weaponValidations.list))
			.query (async ({ ctx, input }) => {
				const { weapons } = schema
				const { gt, desc, like, and } = dbOperators

				const { limit, search } = input
				const cursor = input.cursor ?? "0"
				const items = await ctx
					.db
					.select ()
					.from (weapons)
					.orderBy (({ id }) => desc (id))
					.where ((queryData) => and (
						gt (queryData.id, cursor),
						...(search ? [like (queryData.name, `${search}`)] : [])
					))
					.limit (limit ?? 20)
					.execute ()

				if (items.length !== limit) {
					return {
						items,
						nextCursor: null
					}
				}

				return {
					items,
					nextCursor: items.length > 0 ? _.last (items)!.id : null
				};
			})
})
