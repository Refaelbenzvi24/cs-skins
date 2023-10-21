import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { headers } from "next/headers";

import { TRPCReactProvider } from "./providers";
import useTranslation from "next-translate/useTranslation"
import i18n from "../../../nextjs/i18n"
import { redirect } from "next/navigation"
import { Head } from "next/document"

const fontSans = Inter ({
	subsets:  ["latin"],
	variable: "--font-sans",
});

export const metadata: Metadata = {
	title:       "Create T3 Turbo",
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

export default function RootLayout(props: {
	children: React.ReactNode;
}) {
	const { t, lang } = useTranslation ("common")

	// Redirect to default locale if lang is not supported. /second-page -> /en/second-page
	if (!i18n.locales.includes (lang)) redirect (`/${i18n.defaultLocale}/${lang}`)
	const dir = lang === "he" ? "rtl" : "ltr";

	return (
		<html dir={dir}
		      lang={lang}
		      className={"dark"}>
		<Head>
			<link href="https://fonts.googleapis.com/css?family=Work Sans" rel="stylesheet"/>
			<link href="https://fonts.googleapis.com/css?family=Heebo" rel="stylesheet"/>
		</Head>
		<body className={["font-sans", fontSans.variable].join (" ")}>
		<div id="portals-root"></div>
		<TRPCReactProvider headers={headers ()}>
			{props.children}
		</TRPCReactProvider>
		</body>
		</html>
	);
}
