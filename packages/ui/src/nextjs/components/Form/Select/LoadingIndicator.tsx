"use client";
import produce from "immer"
import { type ComponentProps } from "react"
import { components } from "react-select"
import { useIsDark } from "../../../index"
import { useSelect } from "./index"

const LoadingIndicator = (props: ComponentProps<typeof components.LoadingIndicator>) => {
	const {theme} = useSelect()
	const selectIsDark = theme.isDark
	const isAppDark = useIsDark ()
	const isDark = selectIsDark ?? isAppDark

	return (
		<components.LoadingIndicator
			{...props}
			className="!opacity-80"
			theme={produce (props.theme, (draft) => {
				draft.colors.neutral20 = theme.colors.loadingIndicator.loadingIndicatorColor /** loadingIndicatorColor */

				if (isDark) {
					draft.colors.neutral20 = theme.colorsDark.loadingIndicator.loadingIndicatorColor /** loadingIndicatorColor */
				}
			})}/>
	)
}

export default LoadingIndicator
