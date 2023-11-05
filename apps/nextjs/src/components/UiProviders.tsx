"use client";
import ToastifyContainer from "~/components/ToastifyContainer"
import { MainProvider, ThemeProvider } from "@acme/ui"
import type { ReactNode } from "react"
import type { ThemeOptions } from "@acme/ui/src/nextjs/components/Theme/types"

const UiProviders = (props: {
	children: ReactNode,
	theme: ThemeOptions,
	locale: string
}) => {
	// const currentLocale = useCurrentLocale ()
	// const dir = useDir ()

	return (
		<ThemeProvider
			initialTheme={props.theme}
			defaultTheme={"light"}>
			<MainProvider language={"en"} dir={"ltr"} translationFunction={(_key) => ''}
			              defaults={{ isAnimationsActive: false }}>
				<ToastifyContainer/>
				{props.children}
			</MainProvider>
		</ThemeProvider>
	)
}

export default UiProviders
