import { type ComponentProps } from "react"
import { components } from "react-select"

const MultiValueRemove = (props: ComponentProps<typeof components.MultiValueRemove>) => {
	const { children } = props

	return (
		<components.MultiValueRemove {...props}>
			{children}
		</components.MultiValueRemove>
	)
}

export default MultiValueRemove
