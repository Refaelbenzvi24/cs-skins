import { css, withTheme } from "@emotion/react"
import { shouldForwardProp } from "../../Utils/StyledUtils"
import theme from "../../Utils/theme"
import { AppBarWrapperProps } from "./AppBar"
import { motion } from "framer-motion"
import tw from "twin.macro"
import styled from "@emotion/styled"

const AppBarWrapper = styled (motion.div, {
	shouldForwardProp: (props) => shouldForwardProp<AppBarWrapperProps> (
		["height", "darkBackgroundColor", "dark", "hasBackground", "backgroundColor"]
	) (props as keyof AppBarWrapperProps)
}) ((props: AppBarWrapperProps) => {
	const { height, hasBackground, backgroundColor, darkBackgroundColor, dark } = props

	return [
		tw`flex flex-row fixed w-full items-center`,

		hasBackground && css`
          background-color: ${backgroundColor};
          box-shadow: 0 6px 8px rgba(0, 0, 0, 0.1);
		`,

		css`
          z-index: ${theme.zIndex.appBar};
          transition: all 150ms linear;
          height: ${height}px;

          & ~ #main {
            padding-top: ${height}px;
          }
		`,

		(props) => (hasBackground && (dark || props.theme.isDark)) && css`
          background-color: ${darkBackgroundColor};
		`
	]
})

export default withTheme (AppBarWrapper)
