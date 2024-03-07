import { shouldForwardProp } from "../../utils/StyledUtils"
import { css, withTheme } from "@emotion/react"
import {motion} from "framer-motion"
import tw from "twin.macro"
import styled from "@emotion/styled"
import { SingleColorOptions, ZIndexOptions } from "../Theme/types"
import { getSingleColorFromPath, getZIndexFromPath } from "../../utils/colors"
import { StyledProps } from "../../types"

export interface StyledBackdropProps extends StyledProps {
	dark?: boolean,
	noBackground?: boolean
	backgroundColor?: SingleColorOptions
	backgroundColorDark?: SingleColorOptions
	zIndex?: ZIndexOptions
}

const StyledBackdrop = styled(motion.div, {
	shouldForwardProp: (props) => shouldForwardProp<StyledBackdropProps>(
		['dark', 'noBackground']
	)(props as keyof StyledBackdropProps)
})(({ dark, noBackground, zIndex = 'backdrop', backgroundColor = 'colors.dark_200', backgroundColorDark = 'colors.dark_800', theme }: StyledBackdropProps) => {
	const resolvedBackgroundColor = getSingleColorFromPath(backgroundColor, theme.config)
	const resolvedBackgroundColorDark = getSingleColorFromPath(backgroundColorDark, theme.config)
	const resolvedZIndex = getZIndexFromPath(zIndex, theme.config)
	return [
		tw`fixed h-full w-full opacity-0 !cursor-default`,

		!noBackground && css`
          background-color: ${resolvedBackgroundColor};
		`,

		(props) => css`
          z-index: ${resolvedZIndex};
		`,

		(props) => ((dark || props.theme.isDark) && !noBackground) && css`
          background-color: ${resolvedBackgroundColorDark};
		`,
	]
})

export default withTheme(StyledBackdrop)
