"use client";
import clsx from "clsx"
import { type ComponentProps } from "react"
import { components } from "react-select"
import { css } from "@emotion/css"
import { useIsDark } from "../../../index"
import { useSelect } from "./index"

const Placeholder = (props: ComponentProps<typeof components.Placeholder>) => {
	const { children, className, ...restProps } = props
	const {theme} = useSelect()
	const selectIsDark = theme.isDark
	const isAppDark = useIsDark ()
	const isDark = selectIsDark ?? isAppDark

	return (
		<components.Placeholder
			{...restProps}
			className={clsx (css`
              color: ${/** placeholderTextColor */ theme.colors.placeholder.placeholderTextColor} !important;
			  
			  ${isDark && css`
				color: ${/** placeholderTextColor */ theme.colorsDark.placeholder.placeholderTextColor} !important;
			  `};
			`, className)}>
			{children}
		</components.Placeholder>
	)
}

export default Placeholder
