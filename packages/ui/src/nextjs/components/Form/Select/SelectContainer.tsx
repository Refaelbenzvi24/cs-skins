"use client";
import { theme, useIsDark } from "../../../index"
import { type ComponentProps } from "react"
import { components } from "react-select"
import { css } from "@emotion/css"
import { useSelect } from "./index"
import styled from "@emotion/styled"
import { StyledProps } from "../../../types"
import { shouldForwardProp } from "../../../Utils/StyledUtils"

interface StyledSelectContainerProps extends StyledProps {
	isFocused: boolean
	isDark: boolean
	selectTheme: ReturnType<typeof useSelect>['theme']
}

const StyledSelectContainer = styled (components.SelectContainer, {
	shouldForwardProp: (props) => shouldForwardProp<StyledSelectContainerProps> (
		["isFocused", "isDark", "selectTheme"]
	) (props as keyof StyledSelectContainerProps)
}) (({ isDark, isFocused, selectTheme, theme }: StyledSelectContainerProps) => [
	css`
      background-color: ${/** inputCornersColor */ selectTheme.colors.selectContainer.inputCornersColor} !important;
      box-shadow: ${theme.config.shadows["2"]};
      min-height: inherit;

      ${isFocused && css`
        box-shadow: ${theme.config.shadows["3"]};
      `};

      ${isDark && css`
        background-color: ${/** inputCornersColor */ selectTheme.colorsDark.selectContainer.inputCornersColor} !important;
      `}
	`
])

const SelectContainer = (props: ComponentProps<typeof components.SelectContainer>) => {
	const { children, ...restProps } = props
	const { theme: selectTheme } = useSelect ()
	const selectIsDark = selectTheme.isDark
	const isAppDark = useIsDark ()
	const isDark = selectIsDark ?? isAppDark

	return (
		<StyledSelectContainer selectTheme={selectTheme} isDark={isDark} {...restProps}>
			{children}
		</StyledSelectContainer>
	)
}

export default SelectContainer
