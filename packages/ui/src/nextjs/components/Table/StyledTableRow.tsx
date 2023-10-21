import { ColorsForState } from "../Buttons/Button"
import { shouldForwardProp } from "../../Utils/StyledUtils"
import theme from "../../Utils/theme"
import { css, withTheme } from "@emotion/react"
import styled from "@emotion/styled"
import { motion } from "framer-motion"


export interface StyledTableRowProps {
	height?: string
	width?: string
	clickable?: boolean
	colorsForState?: ColorsForState
	colorsForStateDark?: ColorsForState
	dark?: boolean
}

// const transition = {type: 'spring', stiffness: 500, damping: 50, mass: 1}

const StyledTableRow = styled(motion.tr, {
	shouldForwardProp: (props) => shouldForwardProp<StyledTableRowProps>(
		[
			"height",
			"width",
			"clickable",
			"colorsForState",
			"colorsForStateDark",
			"dark",
		]
	)(props as keyof StyledTableRowProps)
})(({
	    height = "auto",
	    width,
	    colorsForState = theme.colorSchemeByState.accent,
	    colorsForStateDark = theme.colorSchemeByState.overlaysDark,
	    clickable,
	    dark
    }: StyledTableRowProps) => [
	css`
    outline: 0;
    background-color: ${colorsForState!.default};
	`,

	clickable && css`
    &:hover {
      cursor: pointer;
      background-color: ${colorsForState!.hover};
    }

    &:focus {
      background-color: ${colorsForState!.hover};
    }

    &:active {
      background-color: ${colorsForState!.active};
    }

    &:disabled {
      background-color: ${colorsForState!.lightDisabled};

      & > * {
        color: ${colorsForStateDark!.lightDisabledText};
      }
    }
	`,

	height && css`
    height: ${height};
	`,

	width && css`
    width: ${width};
	`,

	(props) => (dark || props.theme.isDark) && css`
    background-color: ${colorsForStateDark!.default};

    ${clickable && css`
      &:hover {
        cursor: pointer;
        background-color: ${colorsForStateDark!.hover};
      }

      &:focus {
        background-color: ${colorsForStateDark!.hover};
      }

      &:active {
        background-color: ${colorsForStateDark!.active};
      }

      &:disabled {
        background-color: ${colorsForStateDark!.darkDisabled};

        & > * {
          color: ${colorsForStateDark!.darkDisabledText};
        }
      }
    `}
	`,
])

export default withTheme(StyledTableRow)
