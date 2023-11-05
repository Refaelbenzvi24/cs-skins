"use client";
import { type ReactElement, useEffect, useMemo, useState } from "react"
import { setCookie } from "cookies-next"
import { ThemeProvider as EmotionThemeProvider, Global } from "@emotion/react"
import { GlobalStyles as BaseStyles } from "twin.macro"
import GlobalStyles from "../../styles/GlobalStyles";
import type { ThemeOptions } from "./types"
import { getInitialTheme, getStorageTheme, ThemeContext } from "./ThemeContext";
import { ThemeConfig } from "./types"
import theme from "../../Utils/theme"
import _ from "lodash"


const updateDomThemeValue = (theme: ThemeOptions) => {
	const root = window.document.documentElement
	const isDark = theme === "dark"

	root.classList.remove (isDark ? "light" : "dark")
	root.classList.add (theme)
}

const updateStorageThemeValue = (theme: ThemeOptions, storageKey: string) => {
	setCookie (storageKey, theme, { maxAge: 60 * 60 * 24 * 30 * 365 })
	localStorage.setItem (storageKey, theme)
}

interface ThemeProviderOptions {
	children: ReactElement
	themeConfig?: Partial<ThemeConfig>
	initialTheme: ThemeOptions | undefined | null
	defaultTheme: ThemeOptions
	storageKey?: string
}

export const defaultThemeConfig: ThemeConfig = {
	zIndex:             theme.zIndex,
	disabledState:      theme.disabledState,
	colorScheme:        theme.colorScheme,
	colorSchemeByState: theme.colorSchemeByState,
	colors:             theme.colors,
	screens:            theme.screens,
	shadows:            theme.shadows,
}

const ThemeProvider = ({ children, storageKey = "theme", defaultTheme, initialTheme, themeConfig = defaultThemeConfig }: ThemeProviderOptions) => {
	const [themeConfigState, _setThemeConfigState] = useState<ThemeConfig> (_.extend (defaultThemeConfig, themeConfig))
	const [theme, setTheme] = useState<ThemeOptions> (initialTheme || getInitialTheme (defaultTheme, storageKey))
	const toggleTheme = () => {
		const currentThemeValue = theme === "dark" ? "light" : "dark"
		setTheme (currentThemeValue)
		updateDomThemeValue (currentThemeValue)
		updateStorageThemeValue (currentThemeValue, storageKey)
	}

	useEffect (() => {
		const syncStateWithStorage = () => {
			const storageValue = getStorageTheme (storageKey)

			if (typeof storageValue === "undefined") return;

			setTheme (storageValue)
			updateDomThemeValue (storageValue)
		}

		window.addEventListener ("storage", syncStateWithStorage)
		return () => {
			window.removeEventListener ("storage", syncStateWithStorage)
		}
	}, [storageKey]);


	return (
		<>
			<BaseStyles/>
			<GlobalStyles/>
			<Global styles={{ html: { scrollBehavior: "smooth" } }}/>
			<EmotionThemeProvider theme={{ isDark: theme === "dark", config: themeConfigState }}>
				<ThemeContext.Provider value={{ themeConfig: themeConfigState, theme, toggleTheme }}>
					{children}
				</ThemeContext.Provider>
			</EmotionThemeProvider>
		</>
	)
}

export default ThemeProvider
