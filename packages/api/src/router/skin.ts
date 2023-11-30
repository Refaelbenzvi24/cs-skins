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
			const { eq, gt, gte, avg, avgDistinct, desc, like, and, lte, sql }                    = dbOperators

			const { limit, skinId, search, dateRange } = input
			const cursor                               = input.cursor ?? "0"

			const query = ctx
			.db
			.select({
				id:         skinsQualitiesData.id,
				skinId:     skins.id,
				weaponName: weapons.name,
				skinName:   skins.name,
				quality:    qualities.name,
				// avgPrice:          avg(skinsQualitiesData.bitSkinsPrice),
				// avgListing:        avg(skinsQualitiesData.steamListings),
				// avgListing2:       sql<string>`AVG(${skinsQualitiesData.steamMedianPrice}) OVER (PARTITION BY EXTRACT('hour' FROM ${skinsQualitiesData.createdAt}), EXTRACT('day' FROM ${skinsQualitiesData.createdAt}))`,
				bitSkinsPrice:     skinsQualitiesData.bitSkinsPrice,
				percentChange:     skinsQualitiesData.percentChange,
				steamListings:     skinsQualitiesData.steamListings,
				steamMediaPrice:   skinsQualitiesData.steamMedianPrice,
				steamVolume:       skinsQualitiesData.steamVolume,
				steamPrice:        skinsQualitiesData.steamPrice,
				createdAt:         skins.createdAt,
				skinDataCreatedAt: skinsQualitiesData.createdAt,
			})
			.from(skinsQualitiesData)
			.leftJoin(skinsQualities, eq(skinsQualities.id, skinsQualitiesData.skinQualityId))
			.leftJoin(skins, eq(skins.id, skinsQualities.skinId))
			.leftJoin(qualities, eq(qualities.id, skinsQualities.qualityId))
			.leftJoin(weaponsSkins, eq(weaponsSkins.skinId, skins.id))
			.leftJoin(weapons, eq(weapons.id, weaponsSkins.weaponId))
			.where((queryData) => and(
				gt(queryData.id, cursor),
				eq(queryData.skinId, skinId),
				...(search ? [like(queryData.quality, `${search}`)] : []),
				...(dateRange?.start && dateRange.end ? [and(
					gte(queryData.skinDataCreatedAt, dateRange.start),
					lte(queryData.skinDataCreatedAt, dateRange.end)
				)] : [])
			))
			.orderBy(({ skinDataCreatedAt }) => desc(skinDataCreatedAt))
			// .groupBy(skins.id, skinsQualitiesData.id, weapons.name, skins.name, qualities.name, skinsQualitiesData.bitSkinsPrice, skinsQualitiesData.percentChange, skinsQualitiesData.steamListings, skinsQualitiesData.steamMedianPrice, skinsQualitiesData.steamVolume, skinsQualitiesData.steamPrice, skins.createdAt, skinsQualitiesData.createdAt)
			.limit(limit ?? 20)

			console.log(query.toSQL())

			const items = await query.execute()

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
