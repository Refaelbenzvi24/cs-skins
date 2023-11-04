import { theme } from "../../index"
import { css, withTheme } from "@emotion/react"
import { CSSProperties } from "react"
import styled, { StyledTags } from "@emotion/styled"
import tw from "twin.macro"
import { SingleColorOptions } from "../Theme/types"
import { getSingleColorFromPath } from "../../Utils/colors"
import { StyledProps } from "../../types"


export type TypographyParagraphTypes = "subtitle" | "body" | "bold" | "small" | "preTitle" | "button" | "link"

export type TypographyVariantOptions =
	"h1" | "h2" | "h3" | TypographyParagraphTypes

export interface StyledTypographyProps extends StyledProps {
	variant: TypographyVariantOptions
	weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
	shadow?: keyof typeof theme.shadows
	spacing?: number
	size?: number | string
	lineHeight?: string
	color?: SingleColorOptions
	colorDark?: SingleColorOptions
	centered?: boolean
	strokeColor?: SingleColorOptions
	darkStrokeColor?: SingleColorOptions
	strokeSize?: number
	dark?: boolean
}

export interface SettingsItem {
	htmlTag: keyof StyledTags
	fontFamily: CSSProperties['fontFamily']
	weight: CSSProperties['fontWeight']
	size: CSSProperties['fontSize']
	spacing: CSSProperties['letterSpacing']
	lineHeight: CSSProperties['lineHeight']
	uppercase: boolean
}

export const settings = {
	h1:       {
		htmlTag:    'h1',
		fontFamily: 'var(--work-sans), var(--heebo)',
		weight:     700,
		size:       4,
		spacing:    -0.02,
		lineHeight: '100%',
		uppercase:  false
	},
	h2:       {
		htmlTag:    'h2',
		fontFamily: 'var(--work-sans), var(--heebo)',
		weight:     700,
		size:       2.5,
		spacing:    -0.02,
		lineHeight: '100%',
		uppercase:  false
	},
	h3:       {
		htmlTag:    'h3',
		fontFamily: 'var(--work-sans), var(--heebo)',
		weight:     700,
		size:       1.5,
		spacing:    -0.02,
		lineHeight: '100%',
		uppercase:  false
	},
	subtitle: {
		htmlTag:    'h4',
		fontFamily: 'var(--work-sans), var(--heebo)',
		weight:     500,
		size:       1.5,
		spacing:    0,
		lineHeight: '100%',
		uppercase:  false
	},
	body:     { htmlTag: 'p', fontFamily: 'var(--work-sans), var(--heebo)', weight: 500, size: 1, spacing: 0, lineHeight: '140%', uppercase: false },
	bold:     { htmlTag: 'p', fontFamily: 'var(--work-sans), var(--heebo)', weight: 700, size: 1, spacing: 0, lineHeight: '100%', uppercase: false },
	small:    {
		htmlTag:    'p',
		fontFamily: 'var(--work-sans), var(--heebo)',
		weight:     500,
		size:       0.875,
		spacing:    0,
		lineHeight: '140%',
		uppercase:  false
	},
	preTitle: {
		htmlTag:    'p',
		fontFamily: 'var(--work-sans), var(--heebo)',
		weight:     700,
		size:       0.825,
		spacing:    0.03,
		lineHeight: '100%',
		uppercase:  true
	},
	button:   {
		htmlTag:    'p',
		fontFamily: 'var(--work-sans), var(--heebo)',
		weight:     700,
		size:       0.625,
		spacing:    0.03,
		lineHeight: '100%',
		uppercase:  true
	},
	link:     { htmlTag: 'p', fontFamily: 'var(--work-sans), var(--heebo)', weight: 700, size: 1, spacing: 0, lineHeight: '100%', uppercase: false },
} as const satisfies Record<TypographyVariantOptions, SettingsItem>

const StyledTypography = styled.p(({
	size,
	weight,
	lineHeight,
	strokeColor,
	darkStrokeColor,
	strokeSize,
	shadow,
	spacing,
	variant,
	color,
	colorDark,
	dark,
	centered,
	theme
}: StyledTypographyProps) => {
	const resolvedColor = getSingleColorFromPath(color, theme.config)
	const resolvedColorDark = getSingleColorFromPath(colorDark, theme.config)
	const resolvedStrokeColor = getSingleColorFromPath(strokeColor, theme.config)
	const resolvedDarkStrokeColor = getSingleColorFromPath(darkStrokeColor, theme.config)
	return [
		!!color && css`
			color: ${resolvedColor};
		`,

		(props) => (!!colorDark && (dark || props.theme.isDark)) && css`
			color: ${resolvedColorDark};
		`,

		shadow && css`
			text-shadow: ${theme.config.shadows[shadow]};
		`,

		strokeColor && css`
			-webkit-text-stroke: ${strokeSize || 1}px ${resolvedStrokeColor};
		`,

		(props) => (!!darkStrokeColor && (dark || props.theme.isDark)) && css`
			-webkit-text-stroke: ${darkStrokeColor || 1}px ${resolvedDarkStrokeColor};
		`,


		settings[variant].uppercase ? tw`uppercase` : '',

		centered && tw`text-center`,

		css`
			font-family: ${settings[variant].fontFamily};
			font-weight: ${weight || settings[variant].weight};
			font-size: ${(typeof size === 'number' ? `${size}rem` : size) || (typeof settings[variant].size === 'number' ? `${settings[variant].size}rem` : settings[variant].size)};
			letter-spacing: ${spacing || settings[variant].spacing}rem;
			line-height: ${lineHeight || settings[variant].lineHeight};
		`,
	]
})

export default withTheme(StyledTypography)
