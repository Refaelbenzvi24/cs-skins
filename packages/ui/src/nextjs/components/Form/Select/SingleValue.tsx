import { useIsDark } from "../../../index"
import { type ComponentProps } from "react"
import { components } from "react-select"
import { css } from "@emotion/css"
import { useSelect } from "./index"

const SingleValue = (props: ComponentProps<typeof components.SingleValue>) => {
	const { children, ...restProps } = props
	const {theme} = useSelect()
	const selectIsDark = theme.isDark
	const isAppDark = useIsDark ()
	const isDark = selectIsDark ?? isAppDark

	return (
		<components.SingleValue {...restProps}
		                        className={css`
                                  color: ${/** currentValueTextColor */ theme.colors.singleValue.currentValueTextColor} !important;
                                  font-weight: ${500};
                                  font-size: 1rem;
                                  line-height: 140%;

                                  ${isDark && css`
                                    color: ${/** currentValueTextColor */ theme.colorsDark.singleValue.currentValueTextColor} !important;
                                  `
                                  }
		                        `}>
			{children}
		</components.SingleValue>
	)
}

export default SingleValue
