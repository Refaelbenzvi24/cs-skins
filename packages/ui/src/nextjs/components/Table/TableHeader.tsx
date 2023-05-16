import styled from "@emotion/styled";
import {css} from "@emotion/react";
import theme from "../../Utils/theme";

export interface TableHeaderProps {
	width?: string
	height?: string
	borderColor?: string
	borderColorDark?: string
	dark?: boolean
	removeBorder?: boolean
}

const TableHeader = styled.th((
	{
		height = "auto",
		width = 'auto',
		borderColor = theme.colorScheme.subtitle2,
		borderColorDark = theme.colorScheme.body1,
		removeBorder,
		dark,
	}: TableHeaderProps) => [
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
    border-bottom: 1px solid ${borderColor};
	`,
	
	(props) => ((dark || props.theme.isDark) && !removeBorder) && css`
    border-bottom: 2px solid ${borderColorDark};
	`
])

export default TableHeader
