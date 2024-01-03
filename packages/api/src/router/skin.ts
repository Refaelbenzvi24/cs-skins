import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc"
import { skinValidations } from "@acme/validations"
import { Producer } from "@acme/message-broker"
import { getPaginationReturning } from "../apiHelpers"
import _ from "lodash"
import { newError } from "../services/logger"


export const skinRouter = createTRPCRouter({
	create:
		protectedProcedure
		.input(z.object(skinValidations.createServer))
		.mutation(async ({ ctx, input }) => {
			try {
				if(Array.isArray(input.url)){
					await Promise.all(input.url.map(async (url) => {
						const producer = new Producer("scraper")
						await producer.initializeProducer(ctx.messageBrokerConnectionParams)
						await producer.sendMessage({ payload: "initial_scrape", url })
					}))
				}
				if(typeof input.url === "string"){
					const producer = new Producer("scraper")
					await producer.initializeProducer(ctx.messageBrokerConnectionParams)
					await producer.sendMessage({ payload: "initial_scrape", url: input.url })
				}
			} catch (error) {
				throw newError.TRPCError("errors:skins.create.failedSendingMessage", "NOT_FOUND", { cause: error })
			}
			return { message: "Sent to scraper service for creation" }
		}),
	getById:
		protectedProcedure
		.input(z.string())
		.query(async ({ ctx, input }) => {
			try {
				return _.first(
					await ctx
					.dbHelper
					.query
					.skins
					.findById({ id: input })
					.execute()
				)
			} catch (error) {
				throw newError.TRPCError("errors:skins.databaseError.getById.failedToSearch", "NOT_FOUND", { cause: error })
			}
		}),
	getByIdWithData:
		protectedProcedure
		.input(z.object(skinValidations.getByIdWithData))
		.query(async ({ ctx, input }) => {
			const { limit, skinId, search, dateRange } = input
			const cursor                               = input.cursor ?? "0"
			try {
				const items = await ctx
				.dbHelper
				.query
				.skinsQualitiesData
				.getBySkinIdWithData({ skinId, search, dateRange, cursor, limit })
				.execute()
				return getPaginationReturning(items, limit ?? 20)
			} catch (error) {
				throw newError.TRPCError("errors:skinsQualitiesData.databaseError.getByIdWithData.failedToSearch", "NOT_FOUND", { cause: error })
			}
		}),
	getByIdWithDataForChart:
		protectedProcedure
		.input(z.object(skinValidations.getByIdWithDataForChart))
		.query(async ({ ctx, input }) => {
			const { skinId, limit, dateRange } = input
			try {
				return await ctx
				.dbHelper
				.query
				.skinsQualitiesData
				.getBySkinIdWithDataForChart({ skinId, limit, dateRange })
				.execute()
			} catch (error) {
				throw newError.TRPCError("errors:skinsQualitiesData.databaseError.getByIdWithDataForChart.failedToSearch", "NOT_FOUND", { cause: error })
			}
		}),
	list:
		protectedProcedure
		.input(z.object(skinValidations.list))
		.query(async ({ ctx, input }) => {

			const { limit, search } = input
			const cursor            = input.cursor ?? "0"
			try {
				const items = await ctx
				.dbHelper
				.query
				.skins
				.list({
					limit,
					search,
					cursor
				})
				.execute()
				return getPaginationReturning(items, limit ?? 20)
			} catch (error) {
				throw newError.TRPCError("errors:skins.databaseError.list.failedToSearch", "NOT_FOUND", { cause: error })
			}
		})
})
