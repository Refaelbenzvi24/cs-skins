/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1)
 * 2. You want to create a new middleware or type of procedure (see Part 3)
 *
 * tl;dr - this is where all the tRPC server stuff is created and plugged in.
 * The pieces you will need to use are documented accordingly near the end
 */
import { initTRPC } from "@trpc/server"
import superjson from "superjson"
import { ZodError } from "zod"
import { auth } from "@acme/auth";
import type { Session } from "@acme/auth";
import { db, dbHelper } from "@acme/db";
import type { EmailProvider } from "./services/email/emailProvider";
import type { BuildConnectionStringProps } from "@acme/message-broker";
import { Producer } from "@acme/message-broker"
import type { PermissionsType } from "@acme/db/src/schema/auth"
import _ from "lodash"
import type { Paths } from "@acme/db/types/objectHelpers"
import { loggerInstance } from "./services/logger"
import type { errorCodesMap } from "./services/logger";
import TRPCError from "@acme/logger/src/Errors/TRPCError"
import type { DefaultErrorShape } from "@trpc/core/src/error/formatter"
import type { errorTranslationKeys } from "./services/logger/errorTranslationKeys"
import type { ErrorNameOptions } from "@acme/logger/src/Errors/BaseError"
import type { typeToFlattenedError } from "zod/lib/ZodError"
import type apm from "elastic-apm-node"


/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API
 *
 * These allow you to access things like the database, the session, etc, when
 * processing a request
 *
 */
interface CreateContextOptions {
	session: Session | null
	emailProvider?: EmailProvider
	messageBrokerConnectionParams: BuildConnectionStringProps
	apm?: apm.Agent
}

/**
 * This helper generates the "internals" for a tRPC context. If you need to use
 * it, you can export it from here
 *
 * Examples of things you may need it for:
 * - testing, so we dont have to mock Next.js' req/res
 * - trpc's `createSSGHelpers` where we don't have req/res
 * @see https://create.t3.gg/en/usage/trpc#-servertrpccontextts
 */
const createInnerTRPCContext = (opts: CreateContextOptions) => {
	const { session, emailProvider, messageBrokerConnectionParams, apm } = opts

	const logger = loggerInstance.logger({
		errorTransformer: 'TRPCError',
		transports:       [
			({ createTransport }) => createTransport({
				severities:                  ["CRITICAL", "ERROR", "WARNING"],
				retries:                     3,
				unknownErrorsTranslationKey: "errors:unknownError",
				retryDelay:                  1000,
				callback:                    async (error) => {
					const producer = new Producer("logs")
					await producer.initializeProducer(messageBrokerConnectionParams)
					await producer.sendMessage({ error })
				}
			})
		]
	})

	return {
		session,
		emailProvider,
		messageBrokerConnectionParams,
		db,
		dbHelper,
		logger,
		newError: loggerInstance.errorBuilder,
		apm
	}
};

/**
 * This is the actual context you'll use in your router. It will be used to
 * process every request that goes through your tRPC endpoint
 * @link https://trpc.io/docs/context
 */
export const createTRPCContext = async (opts: {
	headers: Headers;
	session: Session | null;
}, { emailProvider, messageBrokerConnectionParams, apm }: {
	emailProvider?: EmailProvider,
	messageBrokerConnectionParams: BuildConnectionStringProps,
	apm?: apm.Agent
}) => {
	const session = opts.session ?? (await auth());
	const source  = opts.headers.get("x-trpc-source") ?? "unknown";

	console.log(">>> tRPC Request from", source, "by", session?.user);

	return createInnerTRPCContext({
		emailProvider,
		messageBrokerConnectionParams,
		session,
		apm
	});
};

export type TRPCErrorWithGenerics = TRPCError<
	typeof errorCodesMap,
	typeof errorTranslationKeys,
	keyof typeof errorTranslationKeys,
	ErrorNameOptions,
	keyof typeof errorCodesMap
>

export const getErrorShape = (error: TRPCErrorWithGenerics, shape: DefaultErrorShape, zodError: typeToFlattenedError<unknown, unknown> | null) => ({
	...shape,
	data: {
		...shape.data,
		message:   error.message,
		errorId:   error.errorId,
		errorCode: error.errorCode,
		timestamp: error.timestamp,
		code:      error.code,
		zodError
	}
})

/**
 * 2. INITIALIZATION
 *
 * This is where the trpc api is initialized, connecting the context and
 * transformer
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
	transformer:    superjson,
	errorFormatter: ({ shape, error }) => {
		const zodError = error.cause instanceof ZodError ? error.cause.flatten() : null
		if(error.cause instanceof TRPCError){
			return getErrorShape((error.cause as TRPCErrorWithGenerics), shape, zodError)
		}
		const trpcError = TRPCError.from<
			typeof errorCodesMap,
			typeof errorTranslationKeys,
			typeof loggerInstance.errorBuilder
		>({ errorBuilderInstance: loggerInstance.errorBuilder, errorTranslationKey: "errors:unknownError" }, error)
		return getErrorShape(trpcError as TRPCErrorWithGenerics, shape, zodError)
	}
})


/**
 * Create a server-side caller
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these
 * a lot in the /src/server/api/routers folder
 */

/**
 * This is how you create new routers and subrouters in your tRPC API
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

const errorsMiddleware = t.middleware(async ({ ctx, next, path, input, type }) => {
	// TOOD: maybe remove this
	// ctx.apm?.setTransactionName( `${type}: ${path}`);
	try {
		return await next({
			ctx
		})
	} catch (error) {
		await ctx.logger.logError(error, { path, input, type, session: ctx.session })
	}
})

/**
 * Public (unauthed) procedure
 *
 * This is the base piece you use to build new queries and mutations on your
 * tRPC API. It does not guarantee that a user querying is authorized, but you
 * can still access user session data if they are logged in
 */
export const publicProcedure = t
.procedure
.use(errorsMiddleware)


/**
 * Reusable middleware that enforces users are logged in before running the
 * procedure
 */
const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
	if(!ctx.session?.user){
		throw ctx.newError.TRPCError("errors:authorizationError", "UNAUTHORIZED", { extraDetails: { user: 'public' } });
	}
	return next({
		ctx: {
			session: { ...ctx.session, user: ctx.session.user },
		},
	});
});

export type PermissionsFilter = Paths<PermissionsType>
const enforceUserPermissions = (permissions: PermissionsFilter[]) => t.middleware(({ ctx, next }) => {
	if(!ctx.session?.user){
		throw ctx.newError.TRPCError("errors:authorizationError", "UNAUTHORIZED", { extraDetails: { user: 'public' } });
	}
	const userPermissions         = ctx.session?.user?.permissions ?? {}
	const userHasAdminPermissions = _.get(userPermissions, 'admin', false)
	if(!userHasAdminPermissions){
		const userHasRightPermission = permissions.every((permission) => !!_.get(userPermissions, permission, false))
		if(!userHasRightPermission){
			throw ctx.newError.TRPCError("errors:permissionsError", "UNAUTHORIZED", { extraDetails: { user: ctx.session?.user?.id ?? 'public' } });
		}
	}
	return next({
		ctx: {
			session: { ...ctx.session, user: ctx.session.user },
		},
	});
})

/**
 * Protected (authed) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use
 * this. It verifies the session is valid and guarantees ctx.session.user is not
 * null
 *
 * @see https://trpc.io/docs/procedures
 */
export const protectedProcedure = t
.procedure
.use(errorsMiddleware)
.use(enforceUserIsAuthed)

export const protectedProcedureWithPermissions = (permissions: PermissionsFilter[]) => t
.procedure
.use(errorsMiddleware)
.use(enforceUserPermissions(permissions))
