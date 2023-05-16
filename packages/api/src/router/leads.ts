import {z} from "zod";

import {createTRPCRouter, protectedProcedure, publicProcedure} from "../trpc"
import {leadsValidations} from "@acme/validations"
import {sendContactEmail} from "../services/email/contact/contactEmail"

export const leadsRouter = createTRPCRouter({
	create: publicProcedure
		.input(z.object(leadsValidations.contactObject))
		.mutation(async ({ctx, input}) => {
			const lead = await ctx.prisma.lead.create({data: input})
			await sendContactEmail(ctx.emailProvider, {...input, leadId: lead.id})
			
			return lead
		}),
	getById: protectedProcedure
		.input(z.string())
		.query(({ctx, input}) => {
			return ctx.prisma.lead.findFirst({
				where: {
					id: input
				}
			})
		}),
	list: protectedProcedure
		.input(z.object(leadsValidations.listLeadsObject))
		.query(async ({ctx, input}) => {
			const {cursor, search, limit = 50} = input || {limit: 50}
			
			const nameQueryObject = {
				where: {
					name: {
						contains: search,
						mode: 'insensitive'
					}
				},
			} as const
			
			const items = await ctx.prisma.lead.findMany({
				take: limit + 1,
				cursor: cursor ? {id: cursor} : undefined,
				...(search ? nameQueryObject : {}),
			})
			
			if (items.length !== limit + 1) return {items, nextCursor: undefined}
			
			const nextCursor = items.pop()?.id
			
			return {
				items,
				nextCursor
			}
		})
});
