"use client";
import { useIsDark } from "../../../index"
import { type ComponentProps } from "react"
import { components } from "react-select"
import { css } from "@emotion/css"
import produce from "immer"
import tw from "twin.macro"
import { useSelect } from "./index"
import clsx from "clsx"


const Control = (props: ComponentProps<typeof components.Control>) => {
	const { children, isFocused, ...restProps } = props
	const { theme, props: { textInput } }       = useSelect()
	const selectIsDark                          = theme.isDark
	const isAppDark                             = useIsDark()
	const isDark                                = selectIsDark ?? isAppDark


	return (
		<components.Control {...{ ...restProps, isFocused }}
		                    theme={produce(props.theme, (draft) => {
			                    draft.borderRadius = 5
			                    /** inputActiveBorder */
			                    draft.colors.primary = theme.colors.control.inputActiveBorder
			                    /** inputDefaultBorder */
			                    draft.colors.neutral20 = theme.colors.control.inputDefaultBorder
			                    /** inputHoverBorder */
			                    draft.colors.neutral30 = theme.colors.control.inputHoverBorder

			                    if(isDark){
				                    /** inputActiveBorder */
				                    draft.colors.primary = theme.colorsDark.control.inputActiveBorder
				                    /** inputDefaultBorder */
				                    draft.colors.neutral20 = theme.colorsDark.control.inputDefaultBorder
				                    /** inputHoverBorder */
				                    draft.colors.neutral30 = theme.colorsDark.control.inputHoverBorder
			                    }
		                    })}>
			{children}
		</components.Control>
	)
}

export default Control

