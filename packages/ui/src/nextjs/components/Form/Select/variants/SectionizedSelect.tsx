import { SelectProps, SelectWithLabel } from "../Select"
import { components } from "react-select"
import { Children, ComponentProps } from "react"
import _ from "lodash"


interface SectionizedSelectProps extends Omit<SelectProps, "options"> {
	options: {
		label: string
		options: SelectProps["options"]
	}[]
}


const SectionizedSelect = ({
	                           ...restProps
                           }: SectionizedSelectProps) => {
	return (
		<SelectWithLabel {...restProps}/>
	)
}

export default SectionizedSelect
