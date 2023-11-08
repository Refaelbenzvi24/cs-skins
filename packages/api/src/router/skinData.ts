import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc"
import { skinValidations } from "@acme/validations"
import { dbOperators, schema } from "@acme/db"
import _ from "lodash"


export const skinDataRouter = createTRPCRouter({
	list:
		protectedProcedure
		.input(z.object(skinValidations.list))
		.query(async ({ ctx, input }) => {
			const { skins, weaponsSkins, weapons, skinsQualitiesData, qualities, skinsQualities } = schema
			const { eq, gte, gt, desc, like, or, and }                                            = dbOperators

			const { limit, search } = input
			const cursor            = input.cursor ?? "0"
			const time10MinutesAgo  = new Date(Date.now() - 10 * 60 * 1000)
			const items             = await ctx
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
				gte(queryData.skinQualityDataCreatedAt, time10MinutesAgo),
				gt(queryData.skinQualityDataSteamVolume, 0),
				gte(queryData.skinQualityDataSteamListings, 5),
				gte(queryData.skinQualityDataPercentChange, 20),
				gt(queryData.skinId, cursor),
				...(search ? [or(
					like(queryData.skinName, `${search}`),
					like(queryData.weaponName, `${search}`),
					like(queryData.qualityName, `${search}`)
				)] : [])
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

			if(items.length !== limit){
				return {
					items:      transformedItems,
					nextCursor: null
				}
			}

			return {
				items:      transformedItems,
				nextCursor: items.length > 0 ? _.last(items)!.skinId : null
			};
		})
})
