import { type ComponentProps } from "react"
import { components } from "react-select"
import { css } from "@emotion/css"
import { useSelect } from "./index"
import { useIsDark } from "../../../index"

const IndicatorSeparator = (props:  ComponentProps<typeof components.IndicatorSeparator>) => {
	const {theme} = useSelect()
	const selectIsDark = theme.isDark
	const isAppDark = useIsDark ()
	const isDark = selectIsDark ?? isAppDark

	return (
		<components.IndicatorSeparator
			{...props}
			className={css`
              background-color: ${/** IndicatorSeparatorColor */ theme.colors.indicatorSeparator} !important;
              opacity: 80%;

              ${isDark && css`
                background-color: ${/** IndicatorSeparatorColor */ theme.colorsDark.indicatorSeparator} !important;
              `}
			`}/>
	)
}

export default IndicatorSeparator
