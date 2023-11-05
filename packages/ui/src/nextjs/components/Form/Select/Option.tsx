"use client";
import { type ComponentProps } from "react"
import { components } from "react-select"
import { css } from "@emotion/css"
import tw from "twin.macro"
import produce from "immer"
import { useSelect } from "./index"
import { useIsDark } from "../../../index"

const Option = (props: ComponentProps<typeof components.Option>) => {
	const { theme, ...restProp } = props
	const { theme: selectTheme } = useSelect ()
	const selectIsDark = selectTheme.isDark
	const isAppDark = useIsDark ()
	const isDark = selectIsDark ?? isAppDark

	return (
		<components.Option
			className={css`${tw`!cursor-pointer`}`}
			{...restProp}
			theme={produce (theme, (draft) => {
				/** selectedBackgroundColor */
				draft.colors.primary = selectTheme.colors.option.selectedBackgroundColor
				/** activeBackgroundColor */
				draft.colors.primary50 = selectTheme.colors.option.activeBackgroundColor
				/** hoverBackgroundColor */
				draft.colors.primary25 = selectTheme.colors.option.hoverBackgroundColor

				if (isDark) {
					/** selectedBackgroundColor */
					draft.colors.primary = selectTheme.colorsDark.option.selectedBackgroundColor
					/** activeBackgroundColor */
					draft.colors.primary50 = selectTheme.colorsDark.option.activeBackgroundColor
					/** hoverBackgroundColor */
					draft.colors.primary25 = selectTheme.colorsDark.option.hoverBackgroundColor
				}
			})}>
			{props.children}
		</components.Option>
	)
}

export default Option
