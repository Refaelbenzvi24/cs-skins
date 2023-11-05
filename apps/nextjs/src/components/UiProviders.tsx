"use client";
import ToastifyContainer from "~/components/ToastifyContainer"
import { MainProvider, ThemeProvider } from "@acme/ui"
import type { ReactNode } from "react"
import type { ThemeOptions } from "@acme/ui/src/nextjs/components/Theme/types"
import { useTranslation } from "~/app/i18n/client"
import { dir } from "i18next"

const UiProviders = (props: { children: ReactNode, theme: ThemeOptions }) => {
	const {t, i18n} = useTranslation()

	return (
		<ThemeProvider
			initialTheme={props.theme}
			defaultTheme={"light"}>
			<MainProvider language={i18n.language} dir={dir(i18n.language)} translationFunction={t} defaults={{ isAnimationsActive: false }}>
				<ToastifyContainer/>
				{props.children}
			</MainProvider>
		</ThemeProvider>
	)
}

export default UiProviders
