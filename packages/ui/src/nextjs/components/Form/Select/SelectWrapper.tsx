import styled from "@emotion/styled"
import { motion } from "framer-motion"
import { shouldForwardProp } from "../../../Utils/StyledUtils"
import { css, withTheme } from "@emotion/react"
import tw from "twin.macro"
import { SelectOption } from "./Select"
import { theme } from "../../../index"
import { StyledProps } from "../../../types"


interface SelectWrapperProps {
	label?: string,
	value?: SelectOption | SelectOption[],
	elevation?: keyof typeof theme.shadows
	focusedElevation?: keyof typeof theme.shadows
	persistentLabel?: boolean,
	minContainerHeight?: string,
	isMulti?: boolean
	isFocused?: boolean
	helperText?: string
}

const SelectWrapper = styled (motion.div, {
	shouldForwardProp: (props) => shouldForwardProp<SelectWrapperProps> (
		["label", "value", "persistentLabel", "minContainerHeight", "isMulti", "helperText", "isFocused", "elevation", "focusedElevation"]
	) (props as keyof SelectWrapperProps)
}) (({ label, value, persistentLabel, minContainerHeight,isFocused, isMulti, helperText, elevation = 2, focusedElevation = 3, ...restProps }: SelectWrapperProps) => {
	const { theme } = restProps as StyledProps
	return [
		// ${(!!label && (!!value || persistentLabel)) ? tw`mt-0` : tw`mt-6`}
		// ${!!helperText ? tw`mb-0` : tw`mb-6`}
		css`
          min-height: ${minContainerHeight || isMulti ? "50px" : "38px"};
          box-shadow: ${isFocused ? theme.config.shadows[focusedElevation] : theme.config.shadows[elevation]};
		`
	]
})

export default withTheme(SelectWrapper)
