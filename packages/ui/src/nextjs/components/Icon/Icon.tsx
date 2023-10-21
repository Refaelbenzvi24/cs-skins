"use client";
import { css, withTheme } from "@emotion/react"
import styled from "@emotion/styled"
import { motion } from "framer-motion"
import tw from "twin.macro"

import theme from "../../Utils/theme"


interface IconProps {
	size?: number
	color?: string
	fab?: boolean
	bgColor?: string
	dark?: boolean
	fabSize?: number
}

const Icon = styled(motion.span)(({ size, color, fab, fabSize, bgColor, dark }: IconProps) => [

	fab && tw`rounded-full justify-center items-center flex`,

	fab && (fabSize ? css`
		width: ${fabSize}px;
		height: ${fabSize}px;
	` : tw`p-2`),

	fab && css`
		background-color: ${bgColor || theme.colorScheme.white};
	`,

	(props) => (dark || props.theme.isDark) && fab && css`
		background-color: ${bgColor || theme.colorScheme.overlaysDark};
	`,


	css`
		font-size: ${size}px;
		color: ${color || theme.colorScheme.body2};
	`,

	(props) => (dark || props.theme.isDark) && css`
		color: ${color || theme.colorScheme.accent};
	`,
])


export default withTheme(Icon)
