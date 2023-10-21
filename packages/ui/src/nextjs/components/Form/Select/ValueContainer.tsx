"use client";
import { type ComponentProps } from "react"
import { components } from "react-select"
import { css } from "@emotion/css"
import tw from 'twin.macro'
import { useSelect } from "./index"

const ValueContainer = (props: ComponentProps<typeof components.ValueContainer>) => {
	const { children, ...restProps } = props

	return (
		<components.ValueContainer
			className={css`
			  min-height: inherit;
              ${tw`px-[22px]`};
			`}
			{...restProps}>
			{children}
		</components.ValueContainer>
	)
}

export default ValueContainer
