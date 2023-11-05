import type { Interpolation } from "@emotion/serialize"
import type { Theme } from "@emotion/react"

export interface StyledProps {
	[key: string]: any
	theme: Theme
}

export type StyledFunction<Props> = (props: Props & StyledProps) => [...Array<Interpolation<Props & StyledProps>>]
