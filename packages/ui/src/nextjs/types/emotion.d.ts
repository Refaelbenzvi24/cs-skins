import '@emotion/react'
import { ThemeConfig } from "../components/Theme/types"


declare module '@emotion/react' {
	export interface Theme {
		isDark: boolean
		config: ThemeConfig
	}
}
