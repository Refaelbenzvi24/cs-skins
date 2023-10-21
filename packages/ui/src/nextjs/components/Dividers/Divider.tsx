"use client";
import { css, withTheme } from "@emotion/react"
import styled from "@emotion/styled"
import { motion } from "framer-motion"
import tw from "twin.macro"

import theme from "../../Utils/theme"
import { shouldForwardProp } from "../../Utils/StyledUtils";


interface DividerProps {
	vertical?: boolean
	size?: string
	thickness?: string
	color?: string
	colorDark?: string
	opacity?: string
	dark?: boolean
}

const Divider = styled (motion.hr, {
	shouldForwardProp: (props) => shouldForwardProp<DividerProps> (
		[
			"thickness",
			"opacity",
			"color",
			"colorDark",
			"size",
			"vertical",
			"dark"
		]
	) (props as keyof DividerProps)
}) (({
	     opacity = "100%",
	     size = "100%",
	     thickness = "1px",
	     color = theme.colorScheme.primary,
	     colorDark = theme.colorScheme.primary,
	     vertical,
	     dark
     }: DividerProps) => [
	tw`flex justify-center items-center`,

	css`
      opacity: ${opacity};
      background-color: ${color};
	`,

	!vertical ? css` width: ${size};` : css` height: ${size};`,

	vertical ? css` width: ${thickness};` : css` height: ${thickness};`,

	css`
      border: none;
	`,

	(props) => (dark || props.theme.isDark) && css`
      background-color: ${colorDark};
	`,
])

export default withTheme (Divider)
