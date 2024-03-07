"use client";
import styled from "@emotion/styled"
import { AnimatePresence, HTMLMotionProps, motion } from "framer-motion"
import { shouldForwardProp } from "../../utils/StyledUtils"
import { css } from "@emotion/react"
import { theme as uiTheme, theme } from "../../index"
import { getSingleColorFromPath } from "../../utils/colors"
import { SingleColorOptions } from "../Theme/types"


interface BodyProps extends HTMLMotionProps<"body"> {
	color?: SingleColorOptions
	colorDark?: SingleColorOptions
	backgroundColor?: SingleColorOptions
	backgroundColorDark?: SingleColorOptions
}

const Body = styled(motion.body, {
	shouldForwardProp: (props) => shouldForwardProp<BodyProps>(
		[]
	)(props as keyof BodyProps)
})(({
	color = 'colorScheme.header1',
	colorDark = 'colorScheme.white',
	backgroundColor = 'colorScheme.light',
	backgroundColorDark = 'colorScheme.dark',
}: BodyProps) => {
	const resolvedColor               = getSingleColorFromPath(color, uiTheme)
	const resolvedColorDark           = getSingleColorFromPath(colorDark, uiTheme)
	const resolvedBackgroundColor     = getSingleColorFromPath(backgroundColor, uiTheme)
	const resolvedBackgroundColorDark = getSingleColorFromPath(backgroundColorDark, uiTheme)
	return [
		css`
			color: ${resolvedColor};
			transition: all 0.4s linear;
			background-color: ${resolvedBackgroundColor};

			.dark & {
				color: ${resolvedColorDark};
				background-color: ${resolvedBackgroundColorDark};
			}
		`,
	]
})

export default Body
