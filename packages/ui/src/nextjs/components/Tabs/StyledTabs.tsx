import styled from "@emotion/styled"
import { motion } from "framer-motion"
import { shouldForwardProp } from "../../utils/StyledUtils"
import { css } from "@emotion/react"
import tw from "twin.macro"
import { SingleColorOptions } from "../Theme/types"
import { StyledProps } from "../../types"
import { getSingleColorFromPath } from "../../utils/colors"
import theme from "../../utils/theme"

interface StyledTabsProps {
	backgroundColor?: SingleColorOptions
	backgroundColorDark?: SingleColorOptions
	noShadow?: boolean
	noPadding?: boolean
	elevation?: keyof typeof theme.shadows
	dark?: boolean
}

const StyledTabs = styled (motion.div, {
	shouldForwardProp: (props) => shouldForwardProp<StyledTabsProps> (
		["backgroundColor", "backgroundColorDark", "dark"]
	) (props as keyof StyledTabsProps)
}) (({
	     backgroundColor = "colorScheme.accent",
	     backgroundColorDark = "colorScheme.overlaysDark",
	     dark,
	     elevation = 2,
	     noPadding = false,
	     noShadow = false,
	     ...restProps
     }: StyledTabsProps) => {
	const { theme } = restProps as StyledProps
	const resolvedBackgroundColor = getSingleColorFromPath (backgroundColor, theme.config)
	const resolvedBackgroundColorDark = getSingleColorFromPath (backgroundColorDark, theme.config)
	return [
		tw`rounded`,
		!noPadding && tw`p-2`,
		!noShadow && css`
          box-shadow: ${theme.config.shadows[elevation]};
		`,
		css`
          background-color: ${resolvedBackgroundColor};

          & > * {
            [dir="ltr"] & {
              margin-left: 0.5rem;
            }

            [dir="rtl"] & {
              margin-right: 0.5rem;
            }
          }
		`,
		(props) => dark || props.theme.isDark && css`
          background-color: ${resolvedBackgroundColorDark};
		`
	]
})

export default StyledTabs
