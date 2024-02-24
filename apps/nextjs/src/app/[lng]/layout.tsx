import "../../styles/global.css";
import { cache } from "react"

import { Work_Sans, Heebo } from "next/font/google";
import { cookies, headers } from "next/headers";
import { SessionProvider } from "next-auth/react";
import { dir } from "i18next"

import { TRPCReactProvider } from "./providers";
import type { ThemeOptions } from "@acme/ui/src/nextjs/components/Theme/types"
import UiProviders from "~/components/UiProviders"
import { languages } from "../i18n/settings"
import { Body } from "@acme/ui"
import { getTranslation } from "~/app/i18n"
import type { GenerateMetadataWithLocaleProps, LayoutWithLocaleProps } from "~/types"
import ProgressBar from "~/components/global/ProgressBar"
import Analytics from "~/components/global/Analytics"
import RealUserMonitoring from "~/components/global/RealUserMonitoring"
import WebVitals from "~/components/global/WebVitals"
import ApmProvider from "~/components/ApmProvider"


const workSans = Work_Sans({ weight: ["400", "500", "700"], subsets: ["latin"], variable: "--work-sans" })
const heebo    = Heebo({ weight: ["400", "500", "700"], subsets: ["latin"], variable: "--heebo" })

export function generateStaticParams(){
	return languages.map((lng) => ({ lng }))
}

export async function generateMetadata(props: GenerateMetadataWithLocaleProps){
	const { params: { lng } } = props;
	const { t }               = await getTranslation(lng)

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

// export const viewport: Viewport = {
// 	themeColor: [
// 		{ media: "(prefers-color-scheme: light)", color: "white" },
// 		{ media: "(prefers-color-scheme: dark)", color: "black" },
// 	],
// };

const getHeaders = cache(async () => headers());
export default async function Layout(props: LayoutWithLocaleProps){
	const apm = await import("elastic-apm-node")
	const { params: { lng } } = props
	const cookieStore         = cookies()
	const theme               = cookieStore.get("theme")?.value as ThemeOptions

	return (
		<html
			dir={dir(lng)}
			lang={lng}
			className={theme === "dark" ? "dark" : "light"}>
		<Body className={["work-sans", workSans.variable, "heebo", heebo.variable].join(" ")}>
			<ApmProvider traceId={apm.currentTraceIds["trace.id"]} transactionId={apm.currentTraceIds["transaction.id"]}>
				<ProgressBar/>

				<Analytics/>
				<RealUserMonitoring/>
				<WebVitals/>

				<TRPCReactProvider headersPromise={getHeaders()}>
					<SessionProvider>
						<UiProviders lng={lng} theme={theme}>
							<div id="portals-root"></div>
							{props.children}
						</UiProviders>
					</SessionProvider>
				</TRPCReactProvider>
			</ApmProvider>
		</Body>
		</html>
	);
}
