import styled from "@emotion/styled";
import { css, withTheme } from "@emotion/react";
import theme from "../../utils/theme";
import { SingleColorOptions } from "../Theme/types"
import { getSingleColorFromPath } from "../../utils/colors"
import { StyledProps } from "../../types"

export interface TableHeaderProps  {
	width?: string
	height?: string
	borderColor?: SingleColorOptions
	borderColorDark?: SingleColorOptions
	dark?: boolean
	removeBorder?: boolean
}

const TableHeader = styled.th((
	{
		height = "auto",
		width = 'auto',
		borderColor = 'colorScheme.subtitle2',
		borderColorDark = 'colorScheme.body1',
		removeBorder,
		dark,
		...restProps
	}: TableHeaderProps) => {
	const { theme } = restProps as StyledProps
	const resolvedBorderColor = getSingleColorFromPath(borderColor, theme.config)
	const resolvedBorderColorDark = getSingleColorFromPath(borderColorDark, theme.config)
	return [
		css`
			display: table-cell;
		`,

		height && css`
			width: ${width};
		`,

		width && css`
			height: ${height};
		`,

		!removeBorder && css`
			border-bottom: 1px solid ${resolvedBorderColor};
		`,

		(props) => ((dark || props.theme.isDark) && !removeBorder) && css`
			border-bottom: 2px solid ${resolvedBorderColorDark};
		`
	]
})

export default withTheme(TableHeader)
