import theme from "../../../Utils/theme"
import { transformTransition } from "../../../Utils/transitions"
import { conditionalRotate } from "../../../Utils/utils"
import IconIonChevronDown from "~icons/ion/chevronDown"
import { type ComponentProps } from "react"
import { components } from "react-select"
import { css } from "@emotion/css"
import { useIsDark } from "../../../index"
import { useSelect } from "./index"

const DropdownIndicator = (props: ComponentProps<typeof components.DropdownIndicator>) => {
	const { isFocused } = props
	const {theme: selectTheme} = useSelect()
	const selectIsDark = selectTheme.isDark
	const isAppDark = useIsDark ()
	const isDark = selectIsDark ?? isAppDark

	return (
		<components.DropdownIndicator {...props}>
			<div
				className={css`
                  ${[
                    theme.transitions ([transformTransition ("300ms")]),
                    theme.transforms ([
                      conditionalRotate (isFocused, 180),
                    ]),
                  ]}
                  & > * {
                    color: ${/** DropdownIndicatorColor */ selectTheme.colors.dropdownIndicator.dropdownIndicatorColor} !important;
                    font-weight: ${500};
                    font-size: 1rem;
                    line-height: 140%;
                    opacity: 80%;

                    ${isFocused && css`
                      opacity: 60%;
                    `};
                    
                    ${isDark && css`
                      color: ${/** DropdownIndicatorColor */ selectTheme.colorsDark.dropdownIndicator.dropdownIndicatorColor} !important;
                    `}
                  }`}>
				<IconIonChevronDown/>
			</div>
		</components.DropdownIndicator>
	)
}

export default DropdownIndicator
