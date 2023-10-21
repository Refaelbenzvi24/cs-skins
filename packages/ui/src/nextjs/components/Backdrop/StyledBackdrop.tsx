import { shouldForwardProp } from "../../Utils/StyledUtils"
import { css, withTheme } from "@emotion/react"
import theme from "../../Utils/theme"
import { StyledBackdropProps } from "./Backdrop"
import {motion} from "framer-motion"
import tw from "twin.macro"
import styled from "@emotion/styled"

const StyledBackdrop = styled(motion.div, {
	shouldForwardProp: (props) => shouldForwardProp<StyledBackdropProps>(
		['dark', 'noBackground']
	)(props as keyof StyledBackdropProps)
})(({ dark, noBackground }: StyledBackdropProps) => [
	tw`fixed h-full w-full opacity-0 !cursor-default`,

	!noBackground && css`
		background-color: ${theme.colors.dark_200};
	`,

	css`
		z-index: ${theme.zIndex.backdrop};
	`,

	(props) => ((dark || props.theme.isDark) && !noBackground) && css`
		background-color: ${theme.colors.dark_800};
	`,
])

export default withTheme(StyledBackdrop)
