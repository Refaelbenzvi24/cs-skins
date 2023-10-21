"use client";
import styled from "@emotion/styled";
import { css, withTheme } from "@emotion/react";
import tw from "twin.macro";
import theme from "../../Utils/theme";
import {HTMLMotionProps, motion} from "framer-motion";
import {shouldForwardProp} from "../../Utils/StyledUtils";
import {useEffect, useRef} from "react";

interface ListProps {
	hasBackground?: boolean
	bgColor?: string
	bgColorDark?: string
	dark?: boolean
}

const List = styled.ul((
	{
		hasBackground,
		bgColor = theme.colorScheme.light,
		bgColorDark = theme.colorScheme.overlaysDark,
		dark
	}: ListProps) => [
	tw`flex flex-col w-full`,

	hasBackground && css`
    background-color: ${bgColor};
	`,

	css`
    list-style: none;
	`,

	(props) => ((dark || props.theme.isDark) && hasBackground) && css`
    background-color: ${bgColorDark};
	`
])


export default withTheme(List)
