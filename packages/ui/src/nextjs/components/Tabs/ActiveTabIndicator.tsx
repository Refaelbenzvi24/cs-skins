import styled from "@emotion/styled"
import { motion } from "framer-motion"
import { css } from "@emotion/react"
import tw from "twin.macro"
import { shouldForwardProp } from "../../Utils/StyledUtils"
import { SingleColorOptions, ZIndexOptions } from "../Theme/types"
import { StyledProps } from "../../types"
import { getSingleColorFromPath, getZIndexFromPath } from "../../Utils/colors"


interface ActiveTabIndicatorProps {
	width: number
	height: number
	xPosition: number
	backgroundColor?: SingleColorOptions
	backgroundColorDark?: SingleColorOptions
	zIndex?: ZIndexOptions
	dark?: boolean
}

const ActiveTabIndicator = styled (motion.span, {
	shouldForwardProp: (props) => shouldForwardProp<ActiveTabIndicatorProps> (
		["backgroundColor", "backgroundColorDark", "dark", "xPosition", "width", "height", "zIndex"]
	) (props as keyof ActiveTabIndicatorProps)
}) (({
	     backgroundColor = "colorScheme.primary",
	     backgroundColorDark = "colorScheme.primary",
	     width,
	     height,
	     xPosition,
	     dark,
	     zIndex = 1,
	     ...restProps
     }: ActiveTabIndicatorProps) => {
	const { theme } = restProps as StyledProps
	const resolvedZIndex = getZIndexFromPath (zIndex, theme.config)
	const resolvedBackgroundColor = getSingleColorFromPath (backgroundColor, theme.config)
	const resolvedBackgroundColorDark = getSingleColorFromPath (backgroundColorDark, theme.config)
	return [
		tw`absolute bg-sky-800 transform transition-all ease-in-out duration-500 rounded`,
		css`
          margin-top: -4px;
          margin-left: -4px;
          width: ${(width || 0) + 8}px;
          height: ${(height || 0) + 8}px;
          transform: ${`translate(${xPosition}px)`};
          z-index: ${resolvedZIndex};
          background-color: ${resolvedBackgroundColor};
		`,

		(props) => (dark || props.theme.isDark) && css`
          background-color: ${resolvedBackgroundColorDark};
		`
	]
})

export default ActiveTabIndicator
