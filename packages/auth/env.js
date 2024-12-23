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
	server: {
		DISCORD_CLIENT_ID: dependsOnEnvVar(z.string(), process.env.VALIDATE_DISCORD_CLIENT_VARS),
		DISCORD_CLIENT_SECRET: dependsOnEnvVar(z.string(), process.env.VALIDATE_DISCORD_VARS),
		NEXTAUTH_SECRET:
			process.env.NODE_ENV === "production"
				? z.string().min(1)
				: z.string().min(1).optional(),
		NEXTAUTH_URL: z.preprocess(
			// This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
			// Since NextAuth.js automatically uses the VERCEL_URL if present.
			(str) => process.env.VERCEL_URL ?? str,
			// VERCEL_URL doesn't include `https` so it cant be validated as a URL
			process.env.VERCEL ? z.string() : z.string().url(),
		),
	},
	client: {},
	runtimeEnv: {
		NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
		NEXTAUTH_URL: process.env.NEXTAUTH_URL,
		DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
		DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
	},
	skipValidation: !!process.env.CI || !!process.env.SKIP_ENV_VALIDATION,
});
