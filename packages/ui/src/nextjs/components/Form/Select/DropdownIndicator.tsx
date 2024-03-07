"use client";
import IconIonChevronDown from "~icons/ion/chevronDown"
import { type ComponentProps } from "react"
import { components } from "react-select"
import { css } from "@emotion/react"
import { useIsDark } from "../../../index"
import { useSelect } from "./index"
import styled from "@emotion/styled"
import { motion } from "framer-motion"
import { shouldForwardProp } from "../../../utils/StyledUtils"

interface DropdownIndicatorProps {
	selectTheme: ReturnType<typeof useSelect>["theme"]
	isFocused: boolean
	isDark: boolean
}

const DropdownIndicatorWrapper = styled(motion.div, {
	shouldForwardProp: (props) => shouldForwardProp<DropdownIndicatorProps> (
		["selectTheme", "isFocused", "isDark"]
	) (props as keyof DropdownIndicatorProps)
})(({selectTheme, isFocused, isDark}: DropdownIndicatorProps) => [
	css`
      & > * {
        color: ${/** DropdownIndicatorColor */ selectTheme.colors.dropdownIndicator.dropdownIndicatorColor} !important;
        font-weight: ${500};
        font-size: 1rem;
        line-height: 140%;
        opacity: 80%;

        ${isFocused && css`
          opacity: 60%;
        `};

        ${isDark && css`
          color: ${/** DropdownIndicatorColor */ selectTheme.colorsDark.dropdownIndicator.dropdownIndicatorColor} !important;
        `}
      }`
])

const DropdownIndicator = (props: ComponentProps<typeof components.DropdownIndicator>) => {
	const { isFocused } = props
	const {theme: selectTheme} = useSelect()
	const selectIsDark = selectTheme.isDark
	const isAppDark = useIsDark ()
	const isDark = selectIsDark ?? isAppDark

	return (
		<components.DropdownIndicator {...props}>
			<DropdownIndicatorWrapper
				animate={{
					rotate: isFocused ? 180 : 0,
					transition: {
						duration: 0.25
					}
				}}
				isDark={isDark} isFocused={isFocused} selectTheme={selectTheme}>
				<IconIonChevronDown/>
			</DropdownIndicatorWrapper>
		</components.DropdownIndicator>
	)
}

export default DropdownIndicator
