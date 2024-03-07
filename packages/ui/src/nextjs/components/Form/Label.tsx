"use client";
import { css, withTheme } from "@emotion/react"
import styled from "@emotion/styled"
import { motion } from "framer-motion"
import tw from "twin.macro"

import theme from "../../utils/theme"
import { shouldForwardProp } from "../../utils/StyledUtils";
import { getDisabledColorFromPath, getSingleColorFromPath } from "../../utils/colors"
import { StyledProps } from "../../types"
import { SingleColorOptions } from "../Theme/types"


export interface LabelProps {
	hasBackground?: boolean
	color?: SingleColorOptions
	colorDark?: SingleColorOptions
	backgroundColor?: SingleColorOptions
	backgroundColorDark?: SingleColorOptions
	dark?: boolean,
	dir?: "ltr" | "rtl"
}


const Label = styled(motion.span, {
	shouldForwardProp: (props) => shouldForwardProp<LabelProps>(
		["dark", "dir", "color", "colorDark", "hasBackground", "backgroundColor", "backgroundColorDark"]
	)(props as keyof LabelProps)
})(({
	hasBackground = false,
	color = "colorScheme.body2",
	colorDark = "colorScheme.subtitle2",
	backgroundColor = "colorScheme.accent",
	backgroundColorDark = "colorScheme.overlaysDark",
	dark,
	dir,
	...restProps
}: LabelProps) => {
	const {theme} = restProps as StyledProps
	const resolvedBackgroundColor     = `${getSingleColorFromPath(backgroundColor, theme.config)}e3`
	const resolvedDarkBackgroundColor = `${getSingleColorFromPath(backgroundColorDark, theme.config)}e3`
	const resolvedColor               = getSingleColorFromPath(color, theme.config)
	const resolvedColorDark           = getSingleColorFromPath(colorDark, theme.config)
	return [
		css`
			color: ${resolvedColor};
		`,

		dir === "rtl" && tw`text-right`,

		dir === "ltr" && tw`text-left`,

		tw`whitespace-nowrap text-sm !w-fit px-[2px] min-h-[20px]`,

		hasBackground && css`
			${tw`flex py-0.5 px-2 ml-2`};

			box-shadow: ${theme.config.shadows["2"]};
			background-color: ${resolvedBackgroundColor};
		`,

		(props) => (dark || props.theme.isDark) && css`
			color: ${resolvedColorDark};
		`,

		(props) => (hasBackground && (dark || props.theme.isDark)) && css`
			background-color: ${resolvedDarkBackgroundColor};
		`,
	]
})

export default withTheme(Label)
