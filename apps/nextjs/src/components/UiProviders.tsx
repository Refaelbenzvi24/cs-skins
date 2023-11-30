"use client";
import ToastifyContainer from "~/components/ToastifyContainer"
import { MainProvider, ThemeProvider } from "@acme/ui"
import type { ReactNode } from "react"
import type { ThemeOptions } from "@acme/ui/src/nextjs/components/Theme/types"
import { useTranslation } from "~/app/i18n/client"
import { dir } from "i18next"


const UiProviders = (props: { children: ReactNode, theme: ThemeOptions, lng: string }) => {
	const { t } = useTranslation(props.lng, ["common", "admin", "ui", "toasts"])

	return (
		<ThemeProvider
			initialTheme={props.theme}
			defaultTheme={"light"}>
			<MainProvider language={props.lng}
			              dir={dir(props.lng)}
			              translationFunction={t}
			              defaults={{ isAnimationsActive: false }}>
				<ToastifyContainer/>
				{props.children}
			</MainProvider>
		</ThemeProvider>
	)
}

export default UiProviders
