import { shouldForwardProp } from "../../Utils/StyledUtils"
import { css, withTheme } from "@emotion/react"
import theme from "../../Utils/theme"
import { transformTransition } from "../../Utils/transitions"
import { conditionalTranslate } from "../../Utils/utils"
import { motion } from "framer-motion"
import styled from "@emotion/styled"
import tw from "twin.macro"

export interface StyledSideBarProps {
	dark?: boolean
	width: number
	state?: boolean
	bgColor?: string
	bgColorDark?: string
}

const StyledSideBar = styled(motion.nav, {
	shouldForwardProp: (props) => shouldForwardProp<StyledSideBarProps>(
		['dark', 'width', 'state', 'bgColor', 'bgColorDark']
	)(props as keyof StyledSideBarProps)
})(({dark, bgColor, bgColorDark, width, state}: StyledSideBarProps) => [
	css`
    z-index: ${theme.zIndex.sideBar};
    background-color: ${bgColor};
    width: ${width}px;
	`,

	(props) => (dark || props.theme.isDark) && css`
    background-color: ${bgColorDark};
	`,

	tw`fixed h-full shadow-lg`,
	theme.transitions([transformTransition()]),
	theme.transforms([conditionalTranslate(!state, `-100%`, 'ltr')]),

])

export default withTheme(StyledSideBar)
