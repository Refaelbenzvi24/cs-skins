import Label, {type LabelProps} from "./Label"


interface ConditionalLabelProps extends LabelProps {
	label?: string
	condition?: boolean
}

const defaultProps = {
	label: undefined,
	value: undefined,
} as const

const ConditionalLabel = ({label, condition, ...restProps}: ConditionalLabelProps) => {
	if (condition && label) {
		return <Label {...restProps}>{label}</Label>
	}
	
	return <></>
}

ConditionalLabel.defaultProps = defaultProps

export default ConditionalLabel
