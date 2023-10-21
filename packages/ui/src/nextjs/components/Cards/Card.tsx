"use client";
import { css, withTheme } from "@emotion/react"
import styled from "@emotion/styled"
import { motion } from "framer-motion"
import tw from "twin.macro"

import theme from "../../Utils/theme"
import { shouldForwardProp } from "../../Utils/StyledUtils";


export interface CardProps {
	dark?: boolean,
	height?: string | number
	minHeight?: string
	maxHeight?: string
	width?: string | number
	minWidth?: string
	maxWidth?: string
	bgColor?: string
	bgColorDark?: string
	noShadow?: boolean
	noPadding?: boolean
	elevation?: keyof typeof theme.shadows
}


const Card = styled (motion.div, {
	shouldForwardProp: (props) => shouldForwardProp<CardProps> (
		[
			"dark",
			"height",
			"minHeight",
			"maxHeight",
			"width",
			"minWidth",
			"maxWidth",
			"bgColor",
			"bgColorDark",
			"noShadow",
			"noPadding",
			"elevation"
		]
	) (props as keyof CardProps)
}) (({
	     dark,
	     elevation,
	     noShadow,
	     bgColor = theme.colorScheme.white,
	     bgColorDark = theme.colorScheme.overlaysDark,
	     minHeight,
	     maxHeight,
	     height,
	     minWidth,
	     maxWidth,
	     noPadding,
	     width
     }: CardProps) => [
	tw`flex right-0 overflow-hidden`,

	!noShadow && css`
      box-shadow: ${theme.shadows[elevation || 3]};
	`,

	noPadding ? "" : tw`p-2`,

	css`
      background-color: ${bgColor};
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

	(props) => (dark || props.theme.isDark) && css`
      background-color: ${bgColorDark};
	`
])

export default withTheme(Card)
