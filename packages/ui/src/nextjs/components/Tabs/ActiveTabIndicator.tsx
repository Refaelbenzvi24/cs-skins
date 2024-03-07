import styled from "@emotion/styled"
import { motion } from "framer-motion"
import { css, withTheme } from "@emotion/react"
import tw from "twin.macro"
import { shouldForwardProp } from "../../utils/StyledUtils"
import { SingleColorOptions, ZIndexOptions } from "../Theme/types"
import { StyledProps } from "../../types"
import { getSingleColorFromPath, getZIndexFromPath } from "../../utils/colors"


interface ActiveTabIndicatorProps {
	backgroundColor?: SingleColorOptions
	backgroundColorDark?: SingleColorOptions
	dark?: boolean
}

const ActiveTabIndicator = styled (motion.span, {
	shouldForwardProp: (props) => shouldForwardProp<ActiveTabIndicatorProps> (
		["backgroundColor", "backgroundColorDark", "dark"]
	) (props as keyof ActiveTabIndicatorProps)
}) (({
	     backgroundColor = "colorScheme.primary",
	     backgroundColorDark = "colorScheme.primary",
	     dark,
	     ...restProps
     }: ActiveTabIndicatorProps) => {
	const { theme } = restProps as StyledProps
	const resolvedBackgroundColor = getSingleColorFromPath (backgroundColor, theme.config)
	const resolvedBackgroundColorDark = getSingleColorFromPath (backgroundColorDark, theme.config)
	return [
		tw`absolute rounded h-full w-full`,
		css`
          background-color: ${resolvedBackgroundColor};
		`,

		(props) => (dark || props.theme.isDark) && css`
          background-color: ${resolvedBackgroundColorDark};
		`
	]
})

export default withTheme(ActiveTabIndicator)
