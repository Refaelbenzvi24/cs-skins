"use client";
import { type ComponentProps } from "react"
import { components } from "react-select"
import { css } from "@emotion/css"
import tw from "twin.macro"
import produce from "immer"
import { useSelect } from "./index"
import { Col, Divider, Row, Typography, useIsDark } from "../../../index"

const Option = ({ children, theme, ...restProps }: ComponentProps<typeof components.Option>) => {
	const { theme: selectTheme } = useSelect ()
	const selectIsDark = selectTheme.isDark
	const isAppDark = useIsDark ()
	const isDark = selectIsDark ?? isAppDark

	return (
		<>
			<components.Option
				className={css`${tw`!cursor-pointer`}`}
				{...restProps}
				theme={produce (theme, (draft) => {
					/** selectedBackgroundColor */
					draft.colors.primary = selectTheme.colors.option.selectedBackgroundColor
					/** activeBackgroundColor */
					draft.colors.primary50 = selectTheme.colors.option.activeBackgroundColor
					/** hoverBackgroundColor */
					draft.colors.primary25 = selectTheme.colors.option.hoverBackgroundColor

					if (isDark) {
						/** selectedBackgroundColor */
						draft.colors.primary = selectTheme.colorsDark.option.selectedBackgroundColor
						/** activeBackgroundColor */
						draft.colors.primary50 = selectTheme.colorsDark.option.activeBackgroundColor
						/** hoverBackgroundColor */
						draft.colors.primary25 = selectTheme.colorsDark.option.hoverBackgroundColor
					}
				})}>
				<Row className="justify-between space-x-10">
					<Col>
						<Typography className="whitespace-nowrap"
						            variant="body">
							{children}
						</Typography>
					</Col>

					{!!restProps.data?.extraDetails && (
						<Col>
							<Typography className="whitespace-nowrap"
							            variant="body"
							            color={"colorScheme.subtitle2"}>
								{restProps.data.extraDetails}
							</Typography>
						</Col>
					)}
				</Row>
			</components.Option>
			{!!restProps.data?.bottomDivider && (
				<Row className="py-2 px-[12px]">
					<Divider color="colorScheme.subtitle2" colorDark="colorScheme.body1"/>
				</Row>
			)}
		</>
	)
}

export default Option
