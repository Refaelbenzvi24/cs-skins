"use client";
import { css, withTheme } from "@emotion/react"
import styled from "@emotion/styled"
import { motion } from "framer-motion"
import tw from "twin.macro"

import theme from "../../Utils/theme"
import { shouldForwardProp } from "../../Utils/StyledUtils";

export interface LabelProps {
	hasBackground?: boolean
	color?: string
	colorDark?: string
	bgColor?: string
	bgColorDark?: string
	dark?: boolean,
	dir?: "ltr" | "rtl"
}


const Label = styled (motion.span, {
	shouldForwardProp: (props) => shouldForwardProp<LabelProps> (
		["dark", "dir", "color", "colorDark", "hasBackground", "bgColor", "bgColorDark"]
	) (props as keyof LabelProps)
}) (({
	     hasBackground = false,
	     color = theme.colorScheme.body2,
	     colorDark = theme.colorScheme.subtitle2,
	     bgColor = `${theme.colorScheme.accent}e3`,
	     bgColorDark = `${theme.colorScheme.overlaysDark}e3`,
	     dark,
	     dir
     }: LabelProps) => [
	css`
      color: ${color};
	`,

	(props) => (dark || props.theme.isDark) && css`
      color: ${colorDark};
	`,

	dir === "rtl" && tw`text-right`,

	dir === "ltr" && tw`text-left`,

	tw`whitespace-nowrap text-sm !w-fit px-[2px]`,

	hasBackground && css`
      ${tw`flex py-0.5 px-2 ml-2`};

      box-shadow: ${theme.shadows["2"]};
      background-color: ${bgColor};
	`,

	(props) => (hasBackground && (dark || props.theme.isDark)) && css`
      background-color: ${bgColorDark};
	`,
])

export default withTheme(Label)
