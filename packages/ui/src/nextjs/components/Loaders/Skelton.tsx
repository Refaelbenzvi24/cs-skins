"use client";
import { css } from "@emotion/react"
import styled from "@emotion/styled"
import { motion } from "framer-motion"
import tw from "twin.macro"

import theme from "../../utils/theme"
import { getSingleColorFromPath } from "../../utils/colors"
import { StyledProps } from "../../types"


export interface SkeletonProps extends StyledProps {
	width?: number | string
	height?: number | string
	dark?: boolean
	backgroundColor?: string
	backgroundColorDark?: string
}

const Skeleton = styled(motion.div)((
	{
		dark,
		height = '100%',
		width = '100%',
		backgroundColor = 'colors.gray_300',
		backgroundColorDark = 'colors.gray_700',
		theme
	}: SkeletonProps) => {
	const resolvedBackgroundColor = getSingleColorFromPath(backgroundColor, theme.config)
	const resolvedBackgroundColorDark = getSingleColorFromPath(backgroundColorDark, theme.config)
	return [
		css`
			background-color: ${resolvedBackgroundColor};
		`,

		(props) => (dark || props.theme.isDark) && css`
			background-color: ${resolvedBackgroundColorDark};
		`,

		height && css`
			height: ${typeof height === 'number' ? `${height}px` : height};
		`,
		width && css`
			width: ${typeof width === 'number' ? `${width}px` : width};;
		`,

		tw`animate-pulse`,
	]
})

export default Skeleton
