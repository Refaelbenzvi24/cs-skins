import {createEnv} from "@t3-oss/env-nextjs";
import {z} from "zod";

/**
 * @param {z.ZodSchema<any>} schema
 * @param envVar
 * @returns {z.ZodSchema<any>}
 */
const dependsOnEnvVar = (schema, envVar = "false") => {
	if (envVar === "false") {
		return schema.optional()
	}

	return schema
}

export const env = createEnv({
	shared: {
		VERCEL_URL: z
			.string()
			.optional()
			.transform((v) => (v ? `https://${v}` : undefined)),
		PORT: z.coerce.number().default(3000),
	},
	/**
	 * Specify your server-side environment variables schema here. This way you can ensure the app isn't
	 * built with invalid env vars.
	 */
	server: {
		NEXT_APP_URL: z.string().url(),
		DATABASE_URL: z.string().url(),
		EMAIL_SERVICE_ENABLED: z.string().default("false"),
		EMAIL_PORT: dependsOnEnvVar(z.string(), process.env.VALIDATE_EMAIL_VARS),
		EMAIL_HOST: dependsOnEnvVar(z.string(), process.env.VALIDATE_EMAIL_VARS),
		EMAIL_SERVICE: dependsOnEnvVar(z.string(), process.env.VALIDATE_EMAIL_VARS),
		EMAIL_USER: dependsOnEnvVar(z.string(), process.env.VALIDATE_EMAIL_VARS),
		EMAIL_PASSWORD: dependsOnEnvVar(z.string(), process.env.VALIDATE_EMAIL_VARS),
		MESSAGE_BROKER_HOST: dependsOnEnvVar(z.string(), process.env.VALIDATE_MESSAGE_BROKER_VARS),
		MESSAGE_BROKER_PORT: dependsOnEnvVar(z.string().optional(), process.env.VALIDATE_MESSAGE_BROKER_VARS),
		MESSAGE_BROKER_USER: dependsOnEnvVar(z.string(), process.env.VALIDATE_MESSAGE_BROKER_VARS),
		MESSAGE_BROKER_PASSWORD: dependsOnEnvVar(z.string(), process.env.VALIDATE_MESSAGE_BROKER_VARS),
		MESSAGE_BROKER_PROTOCOL: dependsOnEnvVar(z.string(), process.env.VALIDATE_MESSAGE_BROKER_VARS),
		MESSAGE_BROKER_PATHNAME: dependsOnEnvVar(z.string().optional(), process.env.VALIDATE_MESSAGE_BROKER_VARS),
	},
	/**
	 * Specify your client-side environment variables schema here.
	 * For them to be exposed to the client, prefix them with `NEXT_PUBLIC_`.
	 */
	client: {
		// NEXT_PUBLIC_CLIENTVAR: z.string(),
	},
	/**
	 * Destructure all variables from `process.env` to make sure they aren't tree-shaken away.
	 */
	runtimeEnv: {
		NEXT_APP_URL: process.env.NEXT_APP_URL,
		VERCEL_URL: process.env.VERCEL_URL,
		PORT: process.env.PORT,
		DATABASE_URL: process.env.DATABASE_URL,
		EMAIL_SERVICE_ENABLED: process.env.EMAIL_SERVICE_ENABLED,
		EMAIL_PORT: process.env.EMAIL_PORT,
		EMAIL_SERVICE: process.env.EMAIL_SERVICE,
		EMAIL_HOST: process.env.EMAIL_HOST,
		EMAIL_USER: process.env.EMAIL_USER,
		EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
		MESSAGE_BROKER_HOST: process.env.MESSAGE_BROKER_HOST,
		MESSAGE_BROKER_PORT: process.env.MESSAGE_BROKER_PORT,
		MESSAGE_BROKER_USER: process.env.MESSAGE_BROKER_USER,
		MESSAGE_BROKER_PASSWORD: process.env.MESSAGE_BROKER_PASSWORD,
		MESSAGE_BROKER_PROTOCOL: process.env.MESSAGE_BROKER_PROTOCOL,
		MESSAGE_BROKER_PATHNAME: process.env.MESSAGE_BROKER_PATHNAME
		// NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
	},
	skipValidation:
		!!process.env.CI ||
		!!process.env.SKIP_ENV_VALIDATION ||
		process.env.npm_lifecycle_event === "lint",
});

