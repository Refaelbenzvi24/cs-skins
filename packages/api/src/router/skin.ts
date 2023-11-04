import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc"
import { skinValidations } from "@acme/validations"
import { dbOperators, schema } from "@acme/db"
import { Producer } from "@acme/message-broker"


export const skinRouter = createTRPCRouter({
	create:
		publicProcedure
		.input(z.object(skinValidations.skinObject))
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

			// TODO: create a scraper service and send the data to it
			// TODO: The scraper service will create the skin?
			// TODO: Do not return the skin id, return a message instead?

			return { message: "Sent to scraper service for creation" }
		}),
	getById:
		protectedProcedure
		.input(z.string())
		.query(({ ctx, input }) => {
			return ctx.db.query.skins.findFirst({
				where: ((skins, { eq }) => eq(skins.id, input))
			})
		}),
	list:
		protectedProcedure
		.input(z.object(skinValidations.listSkinObject))
		.query(async ({ ctx, input }) => {
			const { skins, weaponsSkins, weapons, skinsQualitiesData, qualities, skinsQualities } = schema
			const { eq, gte, gt, desc, like, and }                                                = dbOperators

			const limit            = input.limit;
			const cursor           = (input.cursor ?? "0")
			const { search }       = input;
			const time10MinutesAgo = new Date(Date.now() - 10 * 60 * 1000)
			const items            = await ctx
			.db
			.select({
				weaponName:                      weapons.name,
				skinName:                        skins.name,
				skinQualityDataCreatedAt:        skinsQualitiesData.createdAt,
				skinQualityDataSteamVolume:      skinsQualitiesData.steamVolume,
				skinQualityDataSteamListings:    skinsQualitiesData.steamListings,
				skinQualityDataPercentChange:    skinsQualitiesData.percentChange,
				skinQualityDataSteamPrice:       skinsQualitiesData.steamPrice,
				skinQualityDataSteamMedianPrice: skinsQualitiesData.steamMedianPrice,
				skinQualityDataBitSkinsPrice:    skinsQualitiesData.bitSkinsPrice,
				skinId:                          skins.id,
				skinUrl:                         skins.url,
				skinQualityId:                   skinsQualities.id,
				qualityId:                       qualities.id,
				qualityName:                     qualities.name,
			})
			.from(skins)
			.leftJoin(weaponsSkins, eq(weaponsSkins.skinId, skins.id))
			.leftJoin(weapons, eq(weapons.id, weaponsSkins.weaponId))
			.leftJoin(skinsQualities, eq(skinsQualities.skinId, skins.id))
			.leftJoin(skinsQualitiesData, eq(skinsQualitiesData.skinQualityId, skinsQualities.id))
			.leftJoin(qualities, eq(qualities.id, skinsQualities.qualityId))
			.orderBy(({ skinId }) => desc(skinId))
			.where((queryData) => and(
				// gte (queryData.skinQualityDataCreatedAt, time10MinutesAgo),
				gt(queryData.skinQualityDataSteamVolume, 0),
				gte(queryData.skinQualityDataSteamListings, 5),
				gte(queryData.skinQualityDataPercentChange, 20),
				gt(queryData.skinId, cursor),
				like(queryData.skinName, `%${search}%`)
			))
			.limit(limit ?? 20)
			.execute()

			const transformedItems = items.map((item) => ({
				weapon:           item.weaponName,
				skin:             item.skinName,
				quality:          item.qualityName,
				steamPrice:       item.skinQualityDataSteamPrice,
				steamMedianPrice: item.skinQualityDataSteamMedianPrice,
				steamListings:    item.skinQualityDataSteamListings,
				steamVolume:      item.skinQualityDataSteamVolume,
				bitSkinsPrice:    item.skinQualityDataBitSkinsPrice,
				percentChange:    item.skinQualityDataPercentChange,
				createdAt:        item.skinQualityDataCreatedAt,
			}))

			return {
				items:      transformedItems,
				nextCursor: items.length > 0 ? items.pop()!.skinId : null
			};
		})
})
