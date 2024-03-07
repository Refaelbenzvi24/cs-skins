"use client";
import styled from "@emotion/styled";
import { css, withTheme } from "@emotion/react";
import { SingleColorOptions } from "../Theme/types"
import { getSingleColorFromPath } from "../../utils/colors"
import { StyledProps } from "../../types"

interface TableDataProps extends StyledProps {
	height?: string
	width?: string
	borderColor?: SingleColorOptions
	borderColorDark?: SingleColorOptions
	dark?: boolean
	removeBorder?: boolean
}

const TableData = styled.td((
	{
		height = 'auto',
		width = ' 80px',
		borderColor = 'colorScheme.subtitle2',
		borderColorDark = 'colorScheme.body1',
		removeBorder,
		dark,
		theme
	}: TableDataProps) => {
	const resolvedBorderColor = getSingleColorFromPath(borderColor, theme.config)
	const resolvedBorderColorDark = getSingleColorFromPath(borderColorDark, theme.config)
	return [
		height && css`
			height: ${height};
		`,

		width && css`
			width: ${width};
		`,

		!removeBorder && css`
			border-bottom: 1px solid ${resolvedBorderColor};
		`,

		(props) => ((dark || props.theme.isDark) && !removeBorder) && css`
			border-bottom: 1px solid ${resolvedBorderColorDark};
		`
	]
})

export default withTheme(TableData)
