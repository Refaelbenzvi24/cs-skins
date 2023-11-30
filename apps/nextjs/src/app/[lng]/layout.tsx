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
import { getTranslation } from "~/app/i18n"
import type { GenerateMetadataWithLocaleProps, LayoutWithLocaleProps } from "~/types"


const workSans = Work_Sans({ weight: ["400", "500", "700"], subsets: ["latin"], variable: "--work-sans" })
const heebo    = Heebo({ weight: ["400", "500", "700"], subsets: ["latin"], variable: "--heebo" })

export function generateStaticParams(){
	return languages.map((lng) => ({ lng }))
}

export async function generateMetadata(props: GenerateMetadataWithLocaleProps){
	const { params: { lng } } = props;
	const { t } = await getTranslation(lng)

	return {
		title:       t('common:metadata.title'),
		description: t('common:metadata.appDescription'),
		// openGraph:   {
		// 	title:       "Create T3 Turbo",
		// 	description: "Simple monorepo with shared backend for web & mobile apps",
		// 	url:         "https://create-t3-turbo.vercel.app",
		// 	siteName:    "Create T3 Turbo",
		// },
		// twitter:     {
		// 	card:    "summary_large_image",
		// 	site:    "@jullerino",
		// 	creator: "@jullerino",
		// },
	};
}
export default function Layout(props: LayoutWithLocaleProps){
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
					<UiProviders lng={lng} theme={theme}>
						<div id="portals-root"></div>
						{props.children}
					</UiProviders>
				</SessionProvider>
			</TRPCReactProvider>
		</Body>
		</html>
	);
}
