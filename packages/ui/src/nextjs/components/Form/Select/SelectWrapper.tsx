import styled from "@emotion/styled"
import { motion } from "framer-motion"
import { shouldForwardProp } from "../../../Utils/StyledUtils"
import { css } from "@emotion/react"
import tw from "twin.macro"
import { SelectOption } from "./Select"

interface SelectWrapperProps {
	label?: string,
	value?: SelectOption | SelectOption[],
	persistentLabel?: boolean,
	minContainerHeight?: string,
	isMulti?: boolean,
	helperText?: string
}

const SelectWrapper = styled(motion.div, {
	shouldForwardProp: (props) => shouldForwardProp<SelectWrapperProps> (
		["label", "value", "persistentLabel", "minContainerHeight", "isMulti", "helperText"]
	) (props as keyof SelectWrapperProps)
})(({label, value, persistentLabel, minContainerHeight, isMulti, helperText}: SelectWrapperProps) => [
	css`
		${(!!label && (!!value || persistentLabel)) ? tw`mt-0` : tw`mt-6`}
		min-height: ${minContainerHeight || isMulti ? "50px" : "38px"};
		${!!helperText ? tw`mb-0` : tw`mb-6`}
	`
])

export default SelectWrapper
