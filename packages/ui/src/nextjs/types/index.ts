import type {Interpolation} from '@emotion/serialize'
import type {Theme} from '@emotion/react'


export type StyledFunction<Props> = (props: Props) => [...Array<Interpolation<Props & { theme: Theme }>>]

