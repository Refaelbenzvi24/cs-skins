import styled from "@emotion/styled"
import { motion } from "framer-motion"
import { shouldForwardProp } from "../../Utils/StyledUtils"
import { css } from "@emotion/react"
import tw from "twin.macro"
import { SingleColorOptions } from "../Theme/types"
import { StyledProps } from "../../types"
import { getSingleColorFromPath } from "../../Utils/colors"

interface StyledTabsProps {
	backgroundColor?: SingleColorOptions
	backgroundColorDark?: SingleColorOptions
	dark?: boolean
}

const StyledTabs = styled (motion.div, {
	shouldForwardProp: (props) => shouldForwardProp<StyledTabsProps> (
		["backgroundColor", "backgroundColorDark", "dark"]
	) (props as keyof StyledTabsProps)
}) (({
	     backgroundColor = "colorScheme.light2",
	     backgroundColorDark = "colorScheme.overlaysDark",
	     dark,
	     ...restProps
     }: StyledTabsProps) => {
	const { theme } = restProps as StyledProps
	const resolvedBackgroundColor = getSingleColorFromPath (backgroundColor, theme.config)
	const resolvedBackgroundColorDark = getSingleColorFromPath (backgroundColorDark, theme.config)
	return [
		tw`rounded p-2 h-fit `,
		css`
          background-color: ${resolvedBackgroundColor};
		`,
		(props) => dark || props.theme.isDark && css`
          background-color: ${resolvedBackgroundColorDark};
		`
	]
})

export default StyledTabs
