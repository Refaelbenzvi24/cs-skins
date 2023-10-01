import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc"
import { skinValidations } from "@acme/validations"
import type { SkinQuality, Weapon, Skin, SkinData } from "@prisma/client"
import { Producer } from "@acme/message-broker"


export const skinRouter = createTRPCRouter ({
	create: publicProcedure
		        .input (z.object (skinValidations.skinObject))
		        .mutation (async ({ ctx, input }) => {
			        const producer = new Producer ("scraper")
			        await producer.initializeProducer (ctx.messageBrokerConnectionParams)
			        producer.sendMessage ({ payload: "initial_scrape", url: input.url })

			        // TODO: create a scraper service and send the data to it
			        // TODO: The scraper service will create the skin?
			        // TODO: Do not return the skin id, return a message instead?

			        return { message: "Sent to scraper service for creation" }
		        }),

	getById: protectedProcedure
		         .input (z.string ())
		         .query (({ ctx, input }) => {
			         return ctx.prisma.skin.findFirst ({
				         where: {
					         id: input
				         }
			         })
		         }),

	list: protectedProcedure
		      .input (z.object (skinValidations.listSkinObject))
		      .query (async ({ ctx, input }) => {
			      const { cursor, search, limit = 50 } = input || { limit: 50 }

			      const nameQueryObject: Parameters<typeof ctx.prisma.skin.findMany>[0] = {
				      where: {
					      weapon: {
						      name: {
							      contains: search,
							      mode:     "insensitive"
						      }
					      }
				      },
			      } as const

			      const items = await ctx.prisma.skin.findMany ({
				      take:    limit + 1,
				      cursor:  cursor ? { id: cursor } : undefined,
				      where:   {
					      ...(search ? nameQueryObject.where : {}),
					      skinData: {
						      some: {
							      steamVolume:   {
								      gt: 0
							      },
							      steamListings: {
								      gte: 5
							      },
							      percentChange: {
								      gte: 20
							      }
						      }
					      }
				      },
				      include: {
					      weapon:   {
						      select: {
							      name: true
						      }
					      },
					      quality:  {
						      select: {
							      name: true
						      }
					      },
					      skinData: {
						      orderBy: {
							      createdAt: "desc",
						      },
						      where:   {
							      steamVolume:   {
								      gt: 0
							      },
							      steamListings: {
								      gte: 5
							      },
							      percentChange: {
								      gte: 20
							      }
						      },
						      take:    1
					      }
				      },
			      }) as (Skin & { skinData: SkinData[], weapon: Pick<Weapon, "name">, quality: Pick<SkinQuality, "name"> })[]

			      if (items.length !== limit + 1) return { items, nextCursor: undefined }

			      const nextCursor = items.pop ()?.id

			      return {
				      items,
				      nextCursor
			      }
		      })
})
