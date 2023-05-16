import {PrismaAdapter} from "@next-auth/prisma-adapter";
import {type DefaultSession, type NextAuthOptions} from "next-auth";
// import DiscordProvider from "next-auth/providers/discord";
import CredentialProvider from "next-auth/providers/credentials";
import {prisma} from "@acme/db";
import sha256 from "crypto-js/sha256"

/**
 * Module augmentation for `next-auth` types
 * Allows us to add custom properties to the `session` object
 * and keep type safety
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 **/
declare module "next-auth" {
	interface Session extends DefaultSession {
		user: {
			id: string;
			// ...other properties
			// role: UserRole;
		} & DefaultSession["user"];
	}
	
	// interface User {
	//   // ...other properties
	//   // role: UserRole;
	// }
}

const hashPassword = (password: string) => {
	return sha256(password).toString();
};

/**
 * Options for NextAuth.js used to configure
 * adapters, providers, callbacks, etc.
 * @see https://next-auth.js.org/configuration/options
 **/
export const authOptions: NextAuthOptions = {
	// callbacks: {
	// 	session({session, user}) {
	// 		if (session.user) {
	// 			session.user.id = user.id;
	// 			// session.user.role = user.role; <-- put other properties on the session here
	// 		}
	// 		return session;
	// 	},
	// },
	adapter: PrismaAdapter(prisma),
	secret: process.env.NEXTAUTH_SECRET,
	pages: {
		signIn: "/en/admin/login",
	},
	session: {strategy: "jwt"},
	
	providers: [
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
			
			authorize: async (credentials, req) => {
				const user = await prisma.user.findUnique({
					where: {
						email: credentials!.username
					},
					select: {
						id: true,
						name: true,
						email: true,
						image: true,
						password: true,
					}
				})
				
				if (user && user.password == hashPassword(credentials!.password!)) {
					return user;
				} else {
					return null;
				}
			},
		}),
		
		// DiscordProvider({
		//   clientId: process.env.DISCORD_CLIENT_ID as string,
		//   clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
		// }),
		/**
		 * ...add more providers here
		 *
		 * Most other providers require a bit more work than the Discord provider.
		 * For example, the GitHub provider requires you to add the
		 * `refresh_token_expires_in` field to the Account model. Refer to the
		 * NextAuth.js docs for the provider you want to use. Example:
		 * @see https://next-auth.js.org/providers/github
		 **/
	],
};
