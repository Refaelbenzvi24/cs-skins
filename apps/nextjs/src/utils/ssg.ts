import {type GetServerSidePropsContext} from "next"
import {createProxySSGHelpers} from "@trpc/react-query/ssg"
import {getSession} from "next-auth/react"
import superjson from "superjson"
import {appRouter} from "@acme/api"
import {prisma} from "@acme/db"
import getEmailProvider from "~/utils/emailProvider"

export const getProxySSGHelpers = async (context: GetServerSidePropsContext) => {
	const session = await getSession(context)
	const emailProvider = await getEmailProvider()
	
	return await createProxySSGHelpers({
		router: appRouter,
		ctx: {
			session,
			emailProvider,
			prisma
		},
		transformer: superjson
	})
}
