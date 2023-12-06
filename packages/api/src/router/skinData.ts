import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc"
import { skinValidations } from "@acme/validations"
import { getPaginationReturning } from "../apiHelpers"


export const skinDataRouter = createTRPCRouter({
	list:
		protectedProcedure
		.input(z.object(skinValidations.list))
		.query(async ({ ctx, input }) => {
			const { limit, search, cursor } = input
			const items                     = await ctx
			.dbHelper
			.query
			.skinsQualitiesData
			.list({ limit, search, cursor })
			.execute()

			const transformedItems = items.map((item) => ({
				id:               item.skinId,
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

			return getPaginationReturning(transformedItems, limit ?? 20)
		})
})
