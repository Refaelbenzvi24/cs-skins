import "../../styles/global.css";
import type { ReactNode } from "react"

import { Work_Sans, Heebo } from "next/font/google";
import { cookies, headers } from "next/headers";
import { SessionProvider } from "next-auth/react";
import { dir } from "i18next"

import { TRPCReactProvider } from "./providers";
import type { ThemeOptions } from "@acme/ui/src/nextjs/components/Theme/types"
import UiProviders from "~/components/UiProviders"
import { languages } from "../i18n/settings"
import { Body } from "@acme/ui"
import NextTopLoader from 'nextjs-toploader';


const workSans = Work_Sans({ weight: ["400", "500", "700"], subsets: ["latin"], variable: "--work-sans" })
const heebo    = Heebo({ weight: ["400", "500", "700"], subsets: ["latin"], variable: "--heebo" })

interface GenerateMetadataProps {
	children: ReactNode;
	params: { lng: string };
}

// export function generateStaticParams(){
// 	return ["en", "he"].map((locale) => ({ locale }));
// }
//
// async function getMessages(locale: string){
// 	try {
// 		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
// 		return ((await import(`../../../locales/${locale}.yaml`)).default as Record<string, string>);
// 	} catch (error) {
// 		notFound();
// 	}
// }

export function generateStaticParams(){
	return languages.map((lng) => ({ lng }))
}

export function generateMetadata(_props: GenerateMetadataProps){
	// const { params: { lang } } = props;
	// const messages             = await getMessages(lang);

	// You can use the core (non-React) APIs when you have to use next-intl
	// outside of components. Potentially this will be simplified in the future
	// (see https://next-intl-docs.vercel.app/docs/next-13/server-components).
	// const t = createTranslator({ locale: lang });

	return {
		// title: t ("LocaleLayout.title"),
		title:       "CS-Skins",
		description: "Simple monorepo with shared backend for web & mobile apps",
		openGraph:   {
			title:       "Create T3 Turbo",
			description: "Simple monorepo with shared backend for web & mobile apps",
			url:         "https://create-t3-turbo.vercel.app",
			siteName:    "Create T3 Turbo",
		},
		twitter:     {
			card:    "summary_large_image",
			site:    "@jullerino",
			creator: "@jullerino",
		},
	};
}

export default function Layout(props: GenerateMetadataProps){
	const { params: { lng } } = props
	const cookieStore         = cookies()
	const theme               = cookieStore.get("theme")?.value as ThemeOptions


	return (
		<html
			dir={dir(lng)}
			lang={lng}
			className={theme === "dark" ? "dark" : "light"}>
		<Body className={["work-sans", workSans.variable, "heebo", heebo.variable].join(" ")}>
			<NextTopLoader/>
			<TRPCReactProvider headers={headers()}>
				<SessionProvider>
					<UiProviders theme={theme}>
						<div id="portals-root"></div>
						{props.children}
					</UiProviders>
				</SessionProvider>
			</TRPCReactProvider>
		</Body>
		</html>
	);
}
