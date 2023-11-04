"use client";
import { css, withTheme } from "@emotion/react"
import styled from "@emotion/styled"
import { motion } from "framer-motion"
import tw from "twin.macro"

import theme from "../../Utils/theme"
import { getSingleColorFromPath } from "../../Utils/colors"
import { StyledProps } from "../../types"
import { shouldForwardProp } from "../../Utils/StyledUtils"


interface IconProps {
	size?: number
	fab?: boolean
	color?: string
	colorDark?: string
	backgroundColor?: string
	backgroundColorDark?: string
	dark?: boolean
	fabSize?: number
}

const Icon = styled(motion.span, {
	shouldForwardProp: (props) => shouldForwardProp<IconProps>(
		["size", "fab", "color", "colorDark", "backgroundColor", "backgroundColorDark", "dark", "fabSize"]
	)(props as keyof IconProps)
})
(({
	size,
	fab,
	fabSize,
	color,
	colorDark,
	backgroundColor,
	backgroundColorDark,
	dark,
	...restProps
}: IconProps) => {
	const { theme }                   = restProps as StyledProps
	const resolvedBackgroundColor     = getSingleColorFromPath(backgroundColor, theme.config)
	const resolvedDarkBackgroundColor = getSingleColorFromPath(backgroundColorDark, theme.config)
	const resolvedColor               = getSingleColorFromPath(color, theme.config)
	const resolvedColorDark           = getSingleColorFromPath(colorDark, theme.config)
	return [
		fab && tw`rounded-full justify-center items-center flex`,

		fab && (fabSize ? css`
			width: ${fabSize}px;
			height: ${fabSize}px;
		` : tw`p-2`),

		fab && css`
			background-color: ${resolvedBackgroundColor};
		`,

		(props) => (dark || props.theme.isDark) && fab && css`
			background-color: ${resolvedDarkBackgroundColor};
		`,


		css`
			font-size: ${size}px;
			color: ${resolvedColor};
		`,

		(props) => (dark || props.theme.isDark) && css`
			color: ${resolvedColorDark};
		`,
	]
})


export default withTheme(Icon)
