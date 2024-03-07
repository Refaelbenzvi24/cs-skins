import theme, { ThemeColor } from "../../utils/theme"
import { Paths } from "../../types/helpers"
import { CSSProperties } from "react"
export type ThemeOptions = 'dark' | 'light'

export interface ThemeConfig {
	zIndex: typeof theme.zIndex
	screens: typeof theme.screens
	disabledState: typeof theme.disabledState
	colorScheme: typeof theme.colorScheme
	colorSchemeByState: typeof theme.colorSchemeByState
	shadows: typeof theme.shadows
	colors: typeof theme.colors
}

export interface ThemeContextType {
	theme: ThemeOptions
	themeConfig: ThemeConfig
	toggleTheme: () => void
}

export interface ColorsForState {
	default: string
	hover?: string
	active?: string
	lightDisabled?: string
	darkDisabled?: string
	lightDisabledText?: string
	darkDisabledText?: string
}

export type SingleColorOptions = Paths<Pick<ThemeConfig, 'colorScheme' | 'colors'>> | CSSProperties["backgroundColor"]
export type ColorByStateOptions = keyof ThemeConfig['colorSchemeByState'] | ColorsForState
export type DisabledColorOptions = Paths<ThemeConfig['disabledState']> | CSSProperties["backgroundColor"]
export type ZIndexOptions = number |  keyof ThemeConfig['zIndex']
export type ShadowOptions = keyof ThemeConfig['shadows']
export type ScreenOptions = keyof ThemeConfig['screens']
export type DisabledStateOptions = keyof ThemeConfig['disabledState']
