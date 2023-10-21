"use client";
import { css, withTheme } from "@emotion/react"
import styled from "@emotion/styled"
import { motion } from "framer-motion"
import tw from "twin.macro"
import { shouldForwardProp } from "../../Utils/StyledUtils";
import theme from "../../Utils/theme";

export interface HelperTextProps {
	error?: boolean,
	dark?: boolean
	hasBackground?: boolean
	color?: string
	colorDark?: string
	bgColor?: string
	bgColorDark?: string
}


const HelperText = styled (motion.p, {
	shouldForwardProp: (props) => shouldForwardProp<HelperTextProps> (
		[
			"error",
			"dark",
			"hasBackground",
			"color",
			"colorDark",
			"bgColor",
			"bgColorDark"
		]
	) (props as keyof HelperTextProps)
}) (({
	     error = false,
	     dark = false,
	     hasBackground = false,
	     color = theme.colorScheme.error,
	     colorDark = theme.colorScheme.errorDark,
	     bgColor = `${theme.colorScheme.accent}e3`,
	     bgColorDark = `${theme.colorScheme.overlaysDark}e3`
     }: HelperTextProps) => [
	tw`mx-1 mt-1 text-sm min-h-[20px] !w-fit`,

	css`
      color: inherit;
	`,

	error && css`
      color: ${color};
	`,

	(props) => (dark || props.theme.isDark) && error && css`
      color: ${colorDark};
	`,

	hasBackground && css`
      ${tw`flex py-0.5 px-2 pt-1 mt-0 ml-2`};

      box-shadow: ${theme.shadows["2"]};
      background-color: ${bgColor};
	`,

	(props) => (hasBackground && (dark || props.theme.isDark)) && css`
      background-color: ${bgColorDark};
	`,
])

export default withTheme (HelperText)
