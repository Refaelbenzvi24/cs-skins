import { type ComponentProps } from "react"
import { components } from "react-select"
import { css } from "@emotion/css"
import { useIsDark } from "../../../index"
import clsx from "clsx"
import { useSelect } from "./index"

const Input = (props: ComponentProps<typeof components.Input>) => {
	const { className, ...restProps } = props
	const {theme} = useSelect()
	const selectIsDark = theme.isDark
	const isAppDark = useIsDark ()
	const isDark = selectIsDark ?? isAppDark

	return (
		<components.Input {...restProps}
		                  className={clsx (`${css`
                            color: ${/** inputTextColor */ theme.colors.input.inputTextColor} !important;
                            font-weight: ${500};
                            font-size: 1rem;
                            line-height: 140%;

                            ${isDark && css`
                              color: ${/** inputTextColor */ theme.colorsDark.input.inputTextColor} !important;
                            `}
		                  `} ${className}`)}
		/>
	)
}

export default Input
