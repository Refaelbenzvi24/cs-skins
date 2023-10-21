"use client";
import { type ComponentProps } from "react"
import { components } from "react-select"
import { css } from "@emotion/css"
import { useIsDark } from "../../../index"
import clsx from "clsx"
import produce from "immer"
import { useSelect } from "./index"

const MultiValue = (props: ComponentProps<typeof components.MultiValue>) => {
	const { children, className, ...restProps } = props
	const { theme } = useSelect ()
	const selectIsDark = theme.isDark
	const isAppDark = useIsDark ()
	const isDark = selectIsDark ?? isAppDark

	return (
		<components.MultiValue {...restProps}
		                       className={clsx (`${css`
                                 margin: 4px;
                                 height: 36px;

                                 & > div {
                                   margin: 0;
                                   display: flex;
                                   align-items: center;
                                   font-weight: ${500};
                                   font-size: 1rem;
                                   line-height: 140%;
                                   padding-right: 4px;
                                 }

                                 &:last-child {
                                   display: flex;
                                   align-items: center;
                                   justify-content: center;
                                   min-width: 28px;
                                 }
		                       `} ${className}`)}
		                       theme={produce (props.theme, (draft) => {
			                       /** multiValueBgColor */
			                       draft.colors.neutral10 = theme.colors.multiValue.multiValueBgColor
			                       /** multiValueTextColor */
			                       draft.colors.neutral80 = theme.colors.multiValue.multiValueTextColor
			                       /** multiValueRemoveHoverBackground */
			                       draft.colors.dangerLight = theme.colors.multiValue.multiValueRemoveHoverBackground
			                       /** multiValueRemoveHoverIconColor */
			                       draft.colors.danger = theme.colors.multiValue.multiValueRemoveHoverIconColor

			                       if (isDark) {
				                       /** multiValueBgColor */
				                       draft.colors.neutral10 = theme.colorsDark.multiValue.multiValueBgColor
				                       /** multiValueTextColor */
				                       draft.colors.neutral80 = theme.colorsDark.multiValue.multiValueTextColor
				                       /** multiValueRemoveHoverBackground */
				                       draft.colors.dangerLight = theme.colorsDark.multiValue.multiValueRemoveHoverBackground
				                       /** multiValueRemoveHoverIconColor */
				                       draft.colors.danger = theme.colorsDark.multiValue.multiValueRemoveHoverIconColor
			                       }
		                       })}>
			{children}
		</components.MultiValue>
	)
}

export default MultiValue
