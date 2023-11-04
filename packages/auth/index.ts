// import Discord from "@auth/core/providers/discord";
import type { DefaultSession } from "@auth/core/types";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";

import { db, dbOperators, schema, tableCreator } from "@acme/db";

import { env } from "./env.mjs";

export type { Session } from "next-auth";

// Update this whenever adding new providers so that the client can
export const providers = ["discord"] as const;
export type OAuthProviders = (typeof providers)[number];
import sha256 from "crypto-js/sha256"

declare module "next-auth" {
	interface Session {
		user: {
			id: string;
		} & DefaultSession["user"];
	}
}

const hashPassword = (password: string) => {
	return sha256(password).toString();
}

export const {
	handlers: { GET, POST },
	auth,
	CSRF_experimental,
} = NextAuth ({
	adapter:   DrizzleAdapter (db, tableCreator),
	secret: process.env.NEXTAUTH_SECRET,
	session: {strategy: "jwt"},
	providers: [
		// Discord ({
		// 	clientId:     env.DISCORD_CLIENT_ID,
		// 	clientSecret: env.DISCORD_CLIENT_SECRET,
		// }),
		CredentialProvider({
			// The name to display on the sign in form (e.g. "Sign in with...")
			id: "credentials",
			name: "credentials",
			// `credentials` is used to generate a form on the sign in page.
			// You can specify which fields should be submitted, by adding keys to the `credentials` object.
			// e.g. domain, username, password, 2FA token, etc.
			// You can pass any HTML attribute to the <input> tag through the object.
			credentials: {
				username: {label: "Username", type: "text"},
				password: {label: "Password", type: "password"}
			},

			authorize: async (credentials, _req) => {
				if (!credentials?.username || !credentials?.password) {
					return null;
				}


				const {eq} = dbOperators
				const [user] = await
					db
						.select()
						.from(schema.users)
						.where((user) => eq(user.email, (credentials.username as string)))
						.execute()

				if (user && user.password == hashPassword((credentials?.password as string))) {
					return user;
				}

				return null
			},
		}),

	],
	// callbacks: {
	// 	session: ({ session, user }) => ({
	// 		...session,
	// 		user: {
	// 			...session.user,
	// 			id: user.id,
	// 		},
	// 	}),
	//
	// 	jwt: ({ token, profile }) => {
	// 		if (profile?.id) {
	// 			token.id = profile.id;
	// 			token.image = profile.picture;
	// 		}
	// 		return token;
	// 	},
	//
	// 	authorized({ request, auth }) {
	// 		console.log('authorized')
	// 		console.log(auth)
	// 		console.log(request)
	// 		return !!auth?.user
	// 	}
	// },
});
