"use client";
import styled from "@emotion/styled";
import { css, withTheme } from "@emotion/react";
import theme from "../../utils/theme";
import tw from "twin.macro";


interface BeforeIconWrapperProps {
	height?: string
}

const BeforeIconWrapper = styled.div(({ height }: BeforeIconWrapperProps) => [
	css`
		color: ${theme.colorScheme.subtitle1};
		${tw`ltr:pl-[22px] rtl:pr-[22px]`};
		display: flex;
		justify-content: center;
		position: absolute;
		align-items: center;
	`,
	height && css`
		padding-top: calc(${height} / 2 - 8px);
	`
	// ${(localValue && label) || (label && persistentLabel) || (typeof label === "undefined") ? tw`mt-0` : (labelProps?.hasBackground ? tw`mt-[24px]` : tw`mt-[20px]`)};
])

export default withTheme(BeforeIconWrapper)
