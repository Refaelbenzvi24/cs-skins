"use client";
import { css, withTheme } from "@emotion/react"
import styled from "@emotion/styled"
import { motion } from "framer-motion"
import tw from "twin.macro"
import { shouldForwardProp } from "../../utils/StyledUtils";
import { SingleColorOptions } from "../Theme/types"
import { StyledProps } from "../../types"
import { getSingleColorFromPath } from "../../utils/colors"


export interface HelperTextProps {
	error?: boolean,
	dark?: boolean
	hasBackground?: boolean
	color?: SingleColorOptions
	colorDark?: SingleColorOptions
	backgroundColor?: SingleColorOptions
	backgroundColorDark?: SingleColorOptions
}


const HelperText = styled(motion.span, {
	shouldForwardProp: (props) => shouldForwardProp<HelperTextProps>(
		[
			"error",
			"dark",
			"hasBackground",
			"color",
			"colorDark",
			"backgroundColor",
			"backgroundColorDark"
		]
	)(props as keyof HelperTextProps)
})(({
	error = false,
	dark = false,
	hasBackground = false,
	color = 'colorScheme.error',
	colorDark = 'colorScheme.errorDark',
	backgroundColor = 'colorScheme.accent',
	backgroundColorDark = 'colorScheme.overlaysDark',
	...restProps
}: HelperTextProps) => {
	const { theme }                   = restProps as StyledProps
	const resolvedBackgroundColor     = `${getSingleColorFromPath(backgroundColor, theme.config)}e3`
	const resolvedDarkBackgroundColor = `${getSingleColorFromPath(backgroundColorDark, theme.config)}e3`
	const resolvedColor               = getSingleColorFromPath(color, theme.config)
	const resolvedColorDark           = getSingleColorFromPath(colorDark, theme.config)
	return [
		tw`mx-1 mt-1 text-sm min-h-[20px] !w-fit`,

		css`
			color: inherit;
		`,

		error && css`
			color: ${resolvedColor};
		`,

		(props) => (dark || props.theme.isDark) && error && css`
			color: ${resolvedColorDark};
		`,

		hasBackground && css`
			${tw`flex py-0.5 px-2 pt-1 mt-0 ml-2`};

			box-shadow: ${theme.config.shadows["2"]};
			background-color: ${resolvedBackgroundColor};
		`,

		(props) => (hasBackground && (dark || props.theme.isDark)) && css`
			background-color: ${resolvedDarkBackgroundColor};
		`,
	]
})

export default withTheme(HelperText)
