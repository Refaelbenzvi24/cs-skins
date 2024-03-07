import { shouldForwardProp } from "../../utils/StyledUtils"
import { css, withTheme } from "@emotion/react"
import theme from "../../utils/theme"
import { transformTransition } from "../../utils/transitions"
import { conditionalTranslate } from "../../utils/utils"
import { motion } from "framer-motion"
import styled from "@emotion/styled"
import tw from "twin.macro"
import { SingleColorOptions } from "../Theme/types"
import { getSingleColorFromPath } from "../../utils/colors"
import { StyledProps } from "../../types"



export interface StyledSideBarProps extends StyledProps {
	dark?: boolean
	width: number
	state?: boolean
	backgroundColor?: SingleColorOptions
	backgroundColorDark?: SingleColorOptions
}

const StyledSideBar = styled(motion.nav, {
	shouldForwardProp: (props) => shouldForwardProp<StyledSideBarProps>(
		['dark', 'width', 'state', 'backgroundColor', 'backgroundColorDark']
	)(props as keyof StyledSideBarProps)
})(({ dark, backgroundColor = 'colorScheme.white', backgroundColorDark = 'colorScheme.overlaysDark', width, state, theme }: StyledSideBarProps) => {
	const resolvedBackgroundColor     = getSingleColorFromPath(backgroundColor, theme.config)
	const resolvedBackgroundColorDark = getSingleColorFromPath(backgroundColorDark, theme.config)
	return [
		css`
			z-index: ${theme.config.zIndex.sideBar};
			background-color: ${resolvedBackgroundColor};
			width: ${width}px;
		`,

		(props) => (dark || props.theme.isDark) && css`
			background-color: ${resolvedBackgroundColorDark};
		`,

		tw`fixed h-full shadow-lg`,
		// TODO: change to motion transitions
		// theme.transitions([transformTransition()]),
		// theme.transforms([conditionalTranslate(!state, `-100%`, 'ltr')]),

	]
})

export default withTheme(StyledSideBar)
