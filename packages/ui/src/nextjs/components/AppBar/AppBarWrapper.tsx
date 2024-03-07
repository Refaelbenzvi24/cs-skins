import { css, withTheme } from "@emotion/react"
import { shouldForwardProp } from "../../utils/StyledUtils"
import { motion } from "framer-motion"
import tw from "twin.macro"
import styled from "@emotion/styled"
import { SingleColorOptions, ZIndexOptions } from "../Theme/types"
import { getSingleColorFromPath, getZIndexFromPath } from "../../utils/colors"
import { StyledProps } from "../../types"

export interface AppBarWrapperProps extends StyledProps {
	dark?: boolean
	height?: number
	backgroundColor?: SingleColorOptions
	backgroundColorDark?: SingleColorOptions
	hasBackground?: boolean
	zIndex?: ZIndexOptions
}

const AppBarWrapper = styled (motion.div, {
	shouldForwardProp: (props) => shouldForwardProp<AppBarWrapperProps> (
		["height", "backgroundColorDark", "dark", "hasBackground", "backgroundColor"]
	) (props as keyof AppBarWrapperProps)
}) (({ height, hasBackground, dark, theme, zIndex = "appBar", backgroundColor = "colorScheme.accent", backgroundColorDark = "colorScheme.overlaysDark" }: AppBarWrapperProps) => {
	const resolvedBackgroundColor = getSingleColorFromPath (backgroundColor, theme.config)
	const resolvedDarkBackgroundColor = getSingleColorFromPath (backgroundColorDark, theme.config)
	const resolvedZIndex = getZIndexFromPath (zIndex, theme.config)
	return [
		tw`flex flex-row fixed w-full items-center`,

		hasBackground && css`
          background-color: ${resolvedBackgroundColor};
          box-shadow: 0 6px 8px rgba(0, 0, 0, 0.1);
		`,

		css`
          z-index: ${resolvedZIndex};
          transition: all 150ms linear;
          height: ${height}px;

          & ~ #main {
            padding-top: ${height}px;
          }
		`,

		(props) => (hasBackground && (dark || props.theme.isDark)) && css`
          background-color: ${resolvedDarkBackgroundColor};
		`
	]
})

export default withTheme (AppBarWrapper)
