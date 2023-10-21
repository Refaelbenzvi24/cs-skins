"use client";
import styled from "@emotion/styled";
import { css, withTheme } from "@emotion/react";
import theme from "../../Utils/theme";

interface TableDataProps {
	height?: string
	width?: string
	borderColor?: string
	borderColorDark?: string
	dark?: boolean
	removeBorder?: boolean
}

const TableData = styled.td((
	{
		height = 'auto',
		width = ' 80px',
		borderColor = theme.colorScheme.subtitle2,
		borderColorDark = theme.colorScheme.body1,
		removeBorder,
		dark
	}: TableDataProps) => [
	height && css`
    height: ${height};
	`,

	width && css`
    width: ${width};
	`,

	!removeBorder && css`
    border-bottom: 1px solid ${borderColor};
	`,

	(props) => ((dark || props.theme.isDark) && !removeBorder) && css`
    border-bottom: 1px solid ${borderColorDark};
	`
])

export default withTheme(TableData)
