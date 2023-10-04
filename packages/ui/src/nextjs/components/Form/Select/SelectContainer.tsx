import { theme, useIsDark } from "../../../index"
import { type ComponentProps } from "react"
import { components } from "react-select"
import { css } from "@emotion/css"
import { useSelect } from "./index"

const SelectContainer = (props: ComponentProps<typeof components.SelectContainer>) => {
	const { children, ...restProps } = props
	const { isFocused } = restProps
	const {theme: selectTheme} = useSelect()
	const selectIsDark = selectTheme.isDark
	const isAppDark = useIsDark ()
	const isDark = selectIsDark ?? isAppDark

	return (
		<components.SelectContainer {...restProps}
		                            className={css`
                                      background-color: ${/** inputCornersColor */ selectTheme.colors.selectContainer.inputCornersColor} !important;
                                      box-shadow: ${theme.shadows["2"]};
		                              min-height: inherit;

                                      ${isFocused && css`
                                        box-shadow: ${theme.shadows["3"]};
                                      `};

                                      ${isDark && css`
                                        background-color: ${/** inputCornersColor */ selectTheme.colorsDark.selectContainer.inputCornersColor} !important;
                                      `}
		                            `}>
			{children}
		</components.SelectContainer>
	)
}

export default SelectContainer
