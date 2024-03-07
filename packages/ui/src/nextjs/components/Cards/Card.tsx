"use client";
import { css, withTheme } from "@emotion/react"
import styled from "@emotion/styled"
import { motion } from "framer-motion"
import tw from "twin.macro"

import theme from "../../utils/theme"
import { shouldForwardProp } from "../../utils/StyledUtils";
import { SingleColorOptions, ZIndexOptions } from "../Theme/types"
import { getSingleColorFromPath, getZIndexFromPath } from "../../utils/colors"
import { StyledProps } from "../../types"


export interface CardProps extends StyledProps {
	dark?: boolean,
	height?: string | number
	minHeight?: string
	maxHeight?: string
	width?: string | number
	minWidth?: string
	maxWidth?: string
	zIndex?: ZIndexOptions
	backgroundColor?: SingleColorOptions
	backgroundColorDark?: SingleColorOptions
	noShadow?: boolean
	noPadding?: boolean
	elevation?: keyof typeof theme.shadows
	notRounded?: boolean
}


const Card = styled(motion.div, {
	shouldForwardProp: (props) => shouldForwardProp<CardProps>(
		[
			"dark",
			"height",
			"minHeight",
			"maxHeight",
			"width",
			"minWidth",
			"maxWidth",
			"backgroundColor",
			"backgroundColorDark",
			"noShadow",
			"noPadding",
			"notRounded",
			"zIndex",
			"elevation"
		]
	)(props as keyof CardProps)
})(({
	dark,
	elevation = 3,
	noShadow,
	notRounded,
	backgroundColor = "colorScheme.white",
	backgroundColorDark = "colorScheme.overlaysDark",
	minHeight,
	maxHeight,
	height,
	minWidth,
	maxWidth,
	noPadding,
	width,
	zIndex = 0,
	theme
}: CardProps) => {
	const resolvedBackgroundColor     = getSingleColorFromPath(backgroundColor, theme.config)
	const resolvedBackgroundColorDark = getSingleColorFromPath(backgroundColorDark, theme.config)
	const resolvedZIndex              = getZIndexFromPath(zIndex, theme.config)
	return [
		tw`flex right-0 overflow-hidden`,

		!notRounded && tw`rounded`,

		!noShadow && css`
			box-shadow: ${theme.config.shadows[elevation]};
		`,

		noPadding ? "" : tw`p-2`,

		css`
			background-color: ${resolvedBackgroundColor};
		`,

		height && css`
			height: ${typeof height === "number" ? `${height}px` : height};
		`,

		width && css`
			width: ${typeof width === "number" ? `${width}px` : width};
		`,

		minHeight && css`
			min-height: ${minHeight};
		`,
		maxHeight && css`
			max-height: ${maxHeight};
		`,
		minWidth && css`
			min-width: ${minWidth};
		`,
		maxWidth && css`
			max-width: ${maxWidth};
		`,

		zIndex && css`
			z-index: ${resolvedZIndex};
		`,

		(props) => (dark || props.theme.isDark) && css`
			background-color: ${resolvedBackgroundColorDark};
		`
	]
})

export default withTheme(Card)
