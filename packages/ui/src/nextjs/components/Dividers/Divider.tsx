"use client";
import { css, withTheme } from "@emotion/react"
import styled from "@emotion/styled"
import { motion } from "framer-motion"
import tw from "twin.macro"

import theme from "../../utils/theme"
import { shouldForwardProp } from "../../utils/StyledUtils";
import { getSingleColorFromPath, getZIndexFromPath } from "../../utils/colors"
import { StyledProps } from "../../types"
import { SingleColorOptions } from "../Theme/types"


interface DividerProps extends StyledProps {
	vertical?: boolean
	size?: string
	thickness?: string
	color?: SingleColorOptions
	colorDark?: SingleColorOptions
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
	     color = "colorScheme.primary",
	     colorDark = "colorScheme.primary",
	     vertical,
	     dark,
	     theme
     }: DividerProps) => {
	const resolvedColor = getSingleColorFromPath (color, theme.config)
	const resolvedColorDark = getSingleColorFromPath (colorDark, theme.config)
	return [
		tw`flex justify-center items-center`,

		css`
          opacity: ${opacity};
          background-color: ${resolvedColor};
		`,

		!vertical ? css` width: ${size};` : css` height: ${size};`,

		vertical ? css` width: ${thickness};` : css` height: ${thickness};`,

		css`
          border: none;
		`,

		(props) => (dark || props.theme.isDark) && css`
          background-color: ${resolvedColorDark};
		`,
	]
})

export default withTheme (Divider)
