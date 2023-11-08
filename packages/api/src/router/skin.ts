import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc"
import { skinValidations } from "@acme/validations"
import { Producer } from "@acme/message-broker"
import { dbOperators, schema } from "@acme/db"
import _ from "lodash"


export const skinRouter = createTRPCRouter({
	create:
		protectedProcedure
		.input(z.object(skinValidations.createServer))
		.mutation(async ({ ctx, input }) => {
			if(input.url instanceof Array){
				await Promise.all(input.url.map(async (url) => {
					const producer = new Producer("scraper")
					await producer.initializeProducer(ctx.messageBrokerConnectionParams)
					producer.sendMessage({ payload: "initial_scrape", url })
				}))
			}
			if(typeof input.url === "string"){
				const producer = new Producer("scraper")
				await producer.initializeProducer(ctx.messageBrokerConnectionParams)
				producer.sendMessage({ payload: "initial_scrape", url: input.url })
			}

			return { message: "Sent to scraper service for creation" }
		}),
	getById:
		protectedProcedure
		.input(z.string())
		.query(async ({ ctx, input }) => {
			const { skins, weaponsSkins, weapons } = schema
			const { eq }                           = dbOperators
			return _.first(
				await ctx
				.db
				.select({
					id:         skins.id,
					weaponId:   weapons.id,
					weaponName: weapons.name,
					name:       skins.name,
					url:        skins.url,
					createdAt:  skins.createdAt,
				})
				.from(skins)
				.leftJoin(weaponsSkins, eq(weaponsSkins.skinId, skins.id))
				.leftJoin(weapons, eq(weapons.id, weaponsSkins.weaponId))
				.where(eq(skins.id, input))
				.execute()
			)
		}),
	getByIdWithData:
		protectedProcedure
		.input(z.object(skinValidations.getByIdWithData))
		.query(async ({ ctx, input }) => {
			const { skins, weaponsSkins, weapons, skinsQualitiesData, skinsQualities, qualities } = schema
			const { eq, gt, asc, desc, like, and }                                                = dbOperators
			const { limit, skinId, search }                                                  = input
			const cursor                                                                          = input.cursor ?? "0"
			console.log(search)
			const items                                                                           = await ctx
			.db
			.select({
				id:                skins.id,
				skinQualityDataId: skinsQualitiesData.id,
				weaponName:        weapons.name,
				skinName:          skins.name,
				quality:           qualities.name,
				createdAt:         skins.createdAt,
				skinDataCreatedAt: skinsQualitiesData.createdAt,
			})
			.from(skins)
			.leftJoin(skinsQualities, eq(skinsQualities.skinId, skins.id))
			.leftJoin(skinsQualitiesData, eq(skinsQualitiesData.skinQualityId, skinsQualities.id))
			.leftJoin(weaponsSkins, eq(weaponsSkins.skinId, skins.id))
			.leftJoin(weapons, eq(weapons.id, weaponsSkins.weaponId))
			.leftJoin(qualities, eq(qualities.id, skinsQualities.qualityId))
			.orderBy(({ skinQualityDataId }) => asc(skinQualityDataId))
			.where((queryData) => and(
				gt(queryData.skinQualityDataId, cursor),
				eq(queryData.id, skinId),
				...(search ? [like(queryData.quality, `${search}`)] : [])
			))
			.orderBy(({ skinDataCreatedAt }) => desc(skinDataCreatedAt))
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
		}),
	list:
		protectedProcedure
		.input(z.object(skinValidations.list))
		.query(async ({ ctx, input }) => {
			const { skins }                   = schema
			const { gt, desc, like, or, and } = dbOperators

			const { limit, search } = input
			const cursor            = input.cursor ?? "0"
			const items             = await ctx
			.db
			.select()
			.from(skins)
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
