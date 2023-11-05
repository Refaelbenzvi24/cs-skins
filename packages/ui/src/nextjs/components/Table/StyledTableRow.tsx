import { shouldForwardProp } from "../../Utils/StyledUtils"
import { css, withTheme } from "@emotion/react"
import styled from "@emotion/styled"
import { motion } from "framer-motion"
import { ColorByStateOptions } from "../Theme/types"
import { getColorByStateFromPath } from "../../Utils/colors"
import { StyledProps } from "../../types"


export interface StyledTableRowProps extends StyledProps {
	height?: string
	width?: string
	clickable?: boolean
	colorsForStates?: ColorByStateOptions
	colorsForStatesDark?: ColorByStateOptions
	dark?: boolean
}

// const transition = {type: 'spring', stiffness: 500, damping: 50, mass: 1}

const StyledTableRow = styled(motion.tr, {
	shouldForwardProp: (props) => shouldForwardProp<StyledTableRowProps>(
		[
			"height",
			"width",
			"clickable",
			"colorsForStates",
			"colorsForStatesDark",
			"dark",
		]
	)(props as keyof StyledTableRowProps)
})(({
	height = "auto",
	width,
	colorsForStates = "accent",
	colorsForStatesDark = "overlaysDark",
	clickable,
	dark,
	theme
}: StyledTableRowProps) => {
	const resolvedColorsForState     = getColorByStateFromPath(colorsForStates, theme.config)
	const resolvedColorsForStateDark = getColorByStateFromPath(colorsForStatesDark, theme.config)
	return [
		css`
			outline: 0;
			background-color: ${resolvedColorsForState.default};
		`,

		clickable && css`
			&:hover {
				cursor: pointer;
				background-color: ${resolvedColorsForState.hover};
			}

			&:focus {
				background-color: ${resolvedColorsForState.hover};
			}

			&:active {
				background-color: ${resolvedColorsForState.active};
			}

			&:disabled {
				background-color: ${resolvedColorsForState.lightDisabled};

				& > * {
					color: ${resolvedColorsForStateDark.lightDisabledText};
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
			background-color: ${resolvedColorsForStateDark.default};

			${clickable && css`
				&:hover {
					cursor: pointer;
					background-color: ${resolvedColorsForStateDark.hover};
				}

				&:focus {
					background-color: ${resolvedColorsForStateDark.hover};
				}

				&:active {
					background-color: ${resolvedColorsForStateDark.active};
				}

				&:disabled {
					background-color: ${resolvedColorsForStateDark.darkDisabled};

					& > * {
						color: ${resolvedColorsForStateDark.darkDisabledText};
					}
				}
			`}
		`,
	]
})

export default withTheme(StyledTableRow)
