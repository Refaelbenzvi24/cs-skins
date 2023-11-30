"use client";
import { type ComponentProps } from "react"
import { components } from "react-select"
import { useSelect } from "./index"
import { useIsDark } from "../../../index"
import styled from "@emotion/styled"
import { css } from "@emotion/react"

interface GroupHeadingWrapperProps {
	selectTheme: ReturnType<typeof useSelect>["theme"]
	isDark: boolean
}

const GroupHeadingWrapper = styled.div (({ selectTheme, isDark }: GroupHeadingWrapperProps) => [
	css`
      color: ${selectTheme.colors.dropdownIndicator.dropdownIndicatorColor} !important;
	`,

	isDark && css`
      color: ${selectTheme.colorsDark.dropdownIndicator.dropdownIndicatorColor} !important;
	`
])

const GroupHeading = ({ children, ...restProps }: ComponentProps<typeof components.GroupHeading>) => {
	const { theme: selectTheme } = useSelect ()
	const selectIsDark = selectTheme.isDark
	const isAppDark = useIsDark ()
	const isDark = selectIsDark ?? isAppDark

	return (
		<components.GroupHeading
			{...restProps}>
			<GroupHeadingWrapper className="py-[4px]" isDark={isDark} selectTheme={selectTheme}>
				{children}
			</GroupHeadingWrapper>
		</components.GroupHeading>
	)
}

export default GroupHeading
