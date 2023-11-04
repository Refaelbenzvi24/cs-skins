import Typography from "../Typograpy/Typogrphy";
import { AnimatePresence } from "framer-motion";
import TableRow from "./TableRow";
import TableHeader, { TableHeaderProps } from "./TableHeader";
import { ComponentProps, ReactNode, useEffect, useRef } from "react";
import theme from "../../Utils/theme";
import TableData from "./TableData";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import tw from "twin.macro";
import clsx from "clsx";
import { motion } from "framer-motion"
import ImpulseSpinner from "../Loaders/Impulse";
import { v3 as uuidv3 } from 'uuid';


interface TableHeaderOptions<KeysOptions extends string | number | symbol> extends TableHeaderProps {
	key: KeysOptions
	display: string
	tableHeaderProps?: Partial<ComponentProps<typeof TableHeader>>
	tableDataProps?: Partial<ComponentProps<typeof TableData>>
}

interface StyledTableProps {

}

const TableWrapper = styled.div(({}: StyledTableProps) => [
	tw`flex flex-col h-full w-full overflow-y-scroll`
])

interface TablePaginationProps {
	hasPagination: true
	hasNextPage: boolean | undefined
	onNextPage: () => void
}

interface TableProps<
	DataType extends { [key in HeadersKeys]?: any }[],
	HeadersKeys extends string | number | symbol = keyof DataType[number],
> {
	data: DataType
	headers: TableHeaderOptions<HeadersKeys>[]
	actionsWidth?: string
	actions?: (data: any) => ReactNode
	autoFocus?: boolean
	components?: {
		[key in HeadersKeys]?: (item: DataType[number], { bodyColor, bodyColorDark }: {
			bodyColor: string,
			bodyColorDark: string
		}) => ReactNode
	}
	onRowClick?: (item: DataType[number]) => void
	headersColor?: string
	headersColorDark?: string
	bodyColor?: string
	bodyColorDark?: string
	headersHeight?: string
	bodyHeight?: string
	borderColor?: string
	borderColorDark?: string
}

const Table = <
	DataType extends { [key in HeadersKeys]?: any }[],
	HeadersKeys extends string | number | symbol,
>
({
		headers,
		components,
		data,
		headersHeight,
		bodyHeight,
		autoFocus,
		onRowClick,
		headersColor = 'colorScheme.subtitle1',
		headersColorDark = 'colorScheme.subtitle1',
		bodyColor = 'colorScheme.header2',
		bodyColorDark = 'colorScheme.accent',
		borderColor = 'colorScheme.subtitle2',
		borderColorDark = 'colorScheme.body1',
		...restProps
	}:
		TableProps<DataType, HeadersKeys> &
		Omit<React.DetailedHTMLProps<React.TableHTMLAttributes<HTMLTableElement>, HTMLTableElement>, 'children'> &
		(TablePaginationProps | { hasPagination?: false })
) => {
	const props = restProps

	const isFirstRender = useRef(true)

	useEffect(() => {
		isFirstRender.current = false
	}, [])

	return (
		<TableWrapper>
			<table className="w-full h-fit border-spacing-0 border-separate">
				<thead className="sticky top-0 z-[100]">
				<AnimatePresence initial={false}>
					<TableRow
						height={headersHeight}>
						{headers.map(({ display, tableHeaderProps, ...restProps }) => (
							<TableHeader
								{...tableHeaderProps}
								className={`px-[20px] py-[6px] ltr:pl-[32px] rtl:pr-[32px] ${tableHeaderProps?.className ? clsx(tableHeaderProps.className) : ''}`}
								height={headersHeight}
								{...restProps}
								key={String(restProps.key)}>
								<Typography
									className="ltr:text-left rtl:text-right whitespace-nowrap"
									color={headersColor}
									colorDark={headersColorDark}
									variant={'small'}>
									{display}
								</Typography>
							</TableHeader>
						))}
					</TableRow>
				</AnimatePresence>
				</thead>

				<tbody>
				<AnimatePresence initial={false}>
					{data.map((item, index) => (
						<TableRow
							height={bodyHeight}
							clickable={!!onRowClick}
							autoFocus={index === 0 && autoFocus && !isFirstRender.current}
							onClick={() => onRowClick?.(item)}
							key={`${uuidv3(JSON.stringify(item), uuidv3.URL)}:${index}`}>
							{headers.map(({ key, tableDataProps }) => (
								<TableData
									{...tableDataProps}
									removeBorder={index === data.length - 1}
									className={`px-[20px] ltr:pl-[32px] rtl:pr-[32px] py-[8px] ${tableDataProps?.className ? clsx(tableDataProps.className) : ''}`}
									height={bodyHeight}
									key={`${uuidv3(JSON.stringify(item), uuidv3.URL)}:${String(key)}`}>
									{Object.keys(item).length > -1 && (
										(components && components[key]) ? components[key]!(item, { bodyColor, bodyColorDark }) : (
											<Typography
												className="whitespace-nowrap"
												color={bodyColor}
												colorDark={bodyColorDark}
												variant={'small'}>
												{item[key]}
											</Typography>
										)
									)}
								</TableData>
							))}
						</TableRow>
					))}
				</AnimatePresence>
				</tbody>
			</table>
			{(props.hasPagination && props.hasNextPage) && (
				<motion.div
					viewport={{ once: false }}
					onViewportEnter={() => void props.onNextPage()}
					className="flex flex-row justify-center items-center py-2 w-full">
					<ImpulseSpinner size={50} backColor="#626262" frontColor="#536473"/>
				</motion.div>
			)}
		</TableWrapper>
	)
}

export default Table
