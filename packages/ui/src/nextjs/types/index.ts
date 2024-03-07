import type { Interpolation } from "@emotion/serialize"
import { ThemeConfig } from "../components/Theme/types"


export interface Theme {
	isDark: boolean
	config: ThemeConfig
}

export interface StyledProps {
	theme: Theme
}

export type StyledFunction<Props> = (props: Props & StyledProps) => [...Array<Interpolation<Props & StyledProps>>]
