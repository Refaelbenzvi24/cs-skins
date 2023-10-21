import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc"
import { skinValidations } from "@acme/validations"
import { schema, eq, like, desc } from "@acme/db"


export const skinRouter = createTRPCRouter ({
	create: publicProcedure
		        .input (z.object (skinValidations.skinObject))
		        .mutation (async ({ ctx, input }) => {
			        // if (input.url instanceof Array) {
			        //     await Promise.all (input.url.map (async (url) => {
			        //         const producer = new Producer ("scraper")
			        //         await producer.initializeProducer (ctx.messageBrokerConnectionParams)
			        //         producer.sendMessage ({ payload: "initial_scrape", url })
			        //     }))
			        // }
			        // if (typeof input.url === "string") {
			        //     const producer = new Producer ("scraper")
			        //     await producer.initializeProducer (ctx.messageBrokerConnectionParams)
			        //     producer.sendMessage ({ payload: "initial_scrape", url: input.url })
			        // }

			        // TODO: create a scraper service and send the data to it
			        // TODO: The scraper service will create the skin?
			        // TODO: Do not return the skin id, return a message instead?

			        return { message: "Sent to scraper service for creation" }
		        }),

	getById: protectedProcedure
		         .input (z.string ())
		         .query (({ ctx, input }) => {
			         return ctx.db.query.skins.findFirst ({
				         where: ((skins, { eq }) => eq (skins.id, input))
			         })
		         }),

	list: publicProcedure
		      .input (z.object (skinValidations.listSkinObject))
		      .query (async ({ ctx, input }) => {
			      try {
				      const { limit = 10, search = "*", offset = 0 } = input

				      const result = await ctx.db
					      .select ()
					      .from (schema.skins)
					      .leftJoin (schema.skinsQuality, eq (schema.skins.qualityId, schema.skinsQuality.id))
					      .leftJoin (schema.skinsData, eq (schema.skins.id, schema.skinsData.skinId))
					      .leftJoin (schema.weapons, eq (schema.skins.weaponId, schema.weapons.id))
					      .orderBy (desc (schema.skinsData.createdAt))
					      .where (like (schema.weapons.name, search))
					      .limit (limit)
					      .offset (offset)
					      .execute ()

				      return result
			      } catch (error) {
				      console.error (error)
			      }

			      // return ctx.db.query.skins.findMany ({
			      //     where: ((skins, { eq, gt, gte, or }) => or(
			      //
			      //     )),
			      //     with: {
			      // 	  weapon: {
			      //
			      // 	  },
			      //       quality:   {
			      // 	      columns: {
			      // 		      name: true
			      // 	      }
			      //       },
			      //       skinsData: {
			      // 	      where: ((skinsData, { gt, gte, and }) => and (
			      // 		      gt (skinsData.steamVolume, 0),
			      // 		      gte (skinsData.steamListings, 5),
			      // 		      gte (skinsData.percentChange, 20)
			      // 	      )),
			      // 	      orderBy: ((skinsData, { desc }) => desc (skinsData.createdAt)),
			      //       },
			      //     },
			      // })
		      })
})
