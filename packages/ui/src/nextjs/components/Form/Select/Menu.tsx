import { useIsDark } from "../../../index"
import { type ComponentProps } from "react"
import { components } from "react-select"
import { css } from "@emotion/css"
import { useSelect } from "./index"

const Menu = (props: ComponentProps<typeof components.Menu>) => {
	const { children, ...restProps } = props
	const { theme } = useSelect ()
	const selectIsDark = theme.isDark
	const isAppDark = useIsDark ()
	const isDark = selectIsDark ?? isAppDark

	return (
		<components.Menu {...restProps}
		                 className={css`
                           background-color: ${/** menuBackgroundColor */theme.colors.menu.menuBackgroundColor} !important;

                           ${isDark && css`
                             background-color: ${/** menuBackgroundColor */ theme.colorsDark.menu.menuBackgroundColor} !important;
                           `}
		                 `}>
			{children}
		</components.Menu>
	)
}

export default Menu
