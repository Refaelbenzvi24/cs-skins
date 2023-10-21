"use client";
import ToastifyContainer from "~/components/ToastifyContainer"
import { MainProvider, ThemeProvider } from "@acme/ui"
import { ReactNode } from "react"
import { ThemeOptions } from "@acme/ui/src/nextjs/components/Theme/types"

const UiProviders = (props: {children: ReactNode, theme: ThemeOptions}) => {
	return (
		<ThemeProvider
			initialTheme={props.theme}
			defaultTheme={"light"}>
			<MainProvider defaults={{ isAnimationsActive: false }}>
				<ToastifyContainer/>
				{props.children}
			</MainProvider>
		</ThemeProvider>
	)
}

export default UiProviders
