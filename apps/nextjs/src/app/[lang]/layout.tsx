import { Work_Sans, Heebo } from "next/font/google";

import { cookies, headers } from "next/headers";
import { notFound } from "next/navigation";
import { createTranslator, NextIntlClientProvider } from "next-intl";

import { TRPCReactProvider } from "./providers";
import { ReactNode } from "react"
import { ThemeOptions } from "@acme/ui/src/nextjs/components/Theme/types"
import UiProviders from "~/app/providers"
import { Metadata } from "next"

interface GenerateMetadataProps {
	children: ReactNode;
	params: { lang: string };
}


const workSans = Work_Sans ({ weight: ["400", "500", "700"], subsets: ["latin"], variable: "--work-sans" })
const heebo = Heebo ({ weight: ["400", "500", "700"], subsets: ["latin"], variable: "--heebo" })


async function getMessages(locale: string) {
	try {
		return (await import(`../../../locales/${locale}.yaml`)).default;
	} catch (error) {
		notFound ();
	}
}

export async function generateStaticParams() {
	return ["en", "he"].map ((locale) => ({ locale }));
}

export async function generateMetadata(props: GenerateMetadataProps) {
	const { params: { lang } } = props;
	const messages = await getMessages (lang);

	// You can use the core (non-React) APIs when you have to use next-intl
	// outside of components. Potentially this will be simplified in the future
	// (see https://next-intl-docs.vercel.app/docs/next-13/server-components).
	const t = createTranslator ({ locale: lang, messages });

	return {
		title: t ("LocaleLayout.title"),
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

export default async function Layout(props: GenerateMetadataProps) {
	const { params: { lang } } = props;
	const messages = await getMessages (lang);
	const cookieStore = cookies ()

	const dir = lang === "he" ? "rtl" : "ltr";
	const theme = cookieStore.get ("theme")?.value as ThemeOptions

	return (
		<html dir={dir}
		      lang={lang}
		      className={theme === "dark" ? "dark" : "light"}>
		<body className={["work-sans", workSans.variable, "heebo", heebo.variable].join (" ")}>
		<UiProviders theme={theme}>
			<div id="portals-root"></div>
			<NextIntlClientProvider locale={lang} messages={messages}>
				<TRPCReactProvider headers={headers ()}>
					{props.children}
				</TRPCReactProvider>
			</NextIntlClientProvider>
		</UiProviders>
		</body>
		</html>
	);
}
