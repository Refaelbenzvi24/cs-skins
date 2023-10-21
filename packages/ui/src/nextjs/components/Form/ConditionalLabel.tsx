"use client";
import Label, {type LabelProps} from "./Label"
import { withTheme } from "@emotion/react"


interface ConditionalLabelProps extends LabelProps {
	label?: string
	condition?: boolean
}

const ConditionalLabel = ({label, condition, ...restProps}: ConditionalLabelProps) => {
	if (condition && label) {
		return <Label {...restProps}>{label}</Label>
	}

	return <></>
}


export default withTheme(ConditionalLabel)
