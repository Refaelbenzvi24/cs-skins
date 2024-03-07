import { shouldForwardProp } from "../../utils/StyledUtils"
import { css as reactCss, withTheme } from "@emotion/react"
import theme from "../../utils/theme"
import { ModalWrapperProps } from "./Modal"
import { motion } from "framer-motion"
import styled from "@emotion/styled"
import tw from "twin.macro"
import { css } from "@emotion/css"


const ModalWrapper = styled(motion.div, {
	shouldForwardProp: (props) => shouldForwardProp<ModalWrapperProps>(
		["centered", "showAppBar", "appBarHeight", "isAppBarActive"]
	)(props as keyof ModalWrapperProps)
})(({ centered, showAppBar, isAppBarActive, appBarHeight }: ModalWrapperProps) => {
	return [
		reactCss`
        z-index: ${theme.zIndex.modal};
		`,

		(showAppBar && isAppBarActive && appBarHeight) && css`
			top: ${appBarHeight}px;
		`,

		centered && tw`flex justify-center items-center`,
		tw`fixed h-full w-full`,
	]
})

export default withTheme(ModalWrapper)
