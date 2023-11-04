"use client";
import styled from "@emotion/styled";
import { css, withTheme } from "@emotion/react";
import tw from "twin.macro";
import theme from "../../Utils/theme";
import {HTMLMotionProps, motion} from "framer-motion";
import {shouldForwardProp} from "../../Utils/StyledUtils";
import {useEffect, useRef} from "react";
import { SingleColorOptions } from "../Theme/types"
import { getSingleColorFromPath } from "../../Utils/colors"
import { StyledProps } from "../../types"

interface ListProps extends StyledProps {
	hasBackground?: boolean
	backgroundColor?: SingleColorOptions
	backgroundColorDark?: SingleColorOptions
	dark?: boolean
}

const List = styled.ul((
	{
		hasBackground,
		backgroundColor = 'colorScheme.light',
		backgroundColorDark = 'colorScheme.overlaysDark',
		dark,
		theme
	}: ListProps) => {
	const resolvedBackgroundColor = getSingleColorFromPath (backgroundColor, theme.config)
	const resolvedDarkBackgroundColor = getSingleColorFromPath (backgroundColorDark, theme.config)
	return [
		tw`flex flex-col w-full`,

		hasBackground && css`
			background-color: ${resolvedBackgroundColor};
		`,

		css`
			list-style: none;
		`,

		(props) => ((dark || props.theme.isDark) && hasBackground) && css`
			background-color: ${resolvedDarkBackgroundColor};
		`
	]
})


export default withTheme(List)
