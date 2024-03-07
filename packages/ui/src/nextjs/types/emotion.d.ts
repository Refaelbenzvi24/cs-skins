import '@emotion/react'
import { Theme as LibTheme } from './index'


declare module '@emotion/react' {
	export interface Theme extends LibTheme {
	}
}
