import theme from "../../Utils/theme"
import { shouldForwardProp } from "../../Utils/StyledUtils"
import { css, withTheme } from "@emotion/react"
import styled from "@emotion/styled"
import tw from "twin.macro"
import { motion } from "framer-motion"

export interface TooltipContainerProps {
	dark?: boolean,
	color?: string
	bgColor?: string
	noShadow?: boolean
	elevation?: keyof typeof theme.shadows
	top: number | undefined,
	left: number | undefined
}

const TooltipContainer = styled (motion.div, {
	shouldForwardProp: (props) => shouldForwardProp<TooltipContainerProps> (
		[
			"color",
			"noShadow",
			"elevation",
			"bgColor",
			"dark",
			"top",
			"left"
		]
	) (props as keyof TooltipContainerProps)
}) (({ color, noShadow, elevation, bgColor, dark, top, left }: TooltipContainerProps) => [
	tw`inline-block p-3`,

	!noShadow && css`
      box-shadow: ${theme.shadows[elevation || 4]};
	`,

	css`
      color: ${color || theme.colorScheme.body2};
      background-color: ${bgColor || theme.colorScheme.white};
	`,

	(props) => (dark || props.theme.isDark) && css`
      color: ${color || theme.colorScheme.accent};
      background-color: ${bgColor || theme.colorScheme.overlaysDark};
	`,

	css`
      position: fixed;
      white-space: nowrap;
      z-index: ${theme.zIndex.tooltip};
      top: ${top}px;
      left: ${left}px;
	`,
])


export default withTheme(TooltipContainer)
