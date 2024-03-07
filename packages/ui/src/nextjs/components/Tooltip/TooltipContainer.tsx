import theme from "../../utils/theme"
import { shouldForwardProp } from "../../utils/StyledUtils"
import { css, withTheme } from "@emotion/react"
import styled from "@emotion/styled"
import tw from "twin.macro"
import { motion } from "framer-motion"
import { SingleColorOptions, ZIndexOptions } from "../Theme/types"
import { getSingleColorFromPath, getZIndexFromPath } from "../../utils/colors"
import { StyledProps } from "../../types"


export interface TooltipContainerProps extends StyledProps {
	dark?: boolean,
	backgroundColor?: SingleColorOptions
	backgroundColorDark?: SingleColorOptions
	noShadow?: boolean
	elevation?: keyof typeof theme.shadows
	zIndex?: ZIndexOptions
	top: number | undefined,
	left: number | undefined
}

const TooltipContainer = styled(motion.div, {
	shouldForwardProp: (props) => shouldForwardProp<TooltipContainerProps>(
		[
			"noShadow",
			"elevation",
			"backgroundColor",
			"backgroundColorDark",
			"dark",
			"top",
			"left"
		]
	)(props as keyof TooltipContainerProps)
})(({
	noShadow,
	elevation = 4,
	backgroundColor = 'colorScheme.white',
	backgroundColorDark = 'colorScheme.overlaysDark',
	dark,
	top,
	left,
	zIndex = 'tooltip',
	theme
}: TooltipContainerProps) => {
	const resolvedBackgroundColor     = getSingleColorFromPath(backgroundColor, theme.config)
	const resolvedBackgroundColorDark = getSingleColorFromPath(backgroundColorDark, theme.config)
	const resolvedZIndex               = getZIndexFromPath(zIndex, theme.config)
	return [
		tw`inline-block p-3`,

		!noShadow && css`
			box-shadow: ${theme.config.shadows[elevation]};
		`,

		css`
			background-color: ${resolvedBackgroundColor};
		`,

		(props) => (dark || props.theme.isDark) && css`
			background-color: ${resolvedBackgroundColorDark};
		`,

		css`
			position: fixed;
			white-space: nowrap;
			z-index: ${resolvedZIndex};
			top: ${top}px;
			left: ${left}px;
		`,
	]
})


export default withTheme(TooltipContainer)
