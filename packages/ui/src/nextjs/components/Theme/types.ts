export type ThemeOptions = 'dark' | 'light'

export interface ThemeContextType {
	theme: ThemeOptions
	toggleTheme: () => void
}
