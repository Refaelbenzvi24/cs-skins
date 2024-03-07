import type { ComponentProps } from "react"
import styled from "@emotion/styled"
import type { ButtonProps } from "../../Buttons/Button";
import Button, { buttonPropsArray, ButtonStyles } from "../../Buttons/Button"
import { motion } from "framer-motion"
import { shouldForwardProp } from "../../../utils/StyledUtils"
import { css, withTheme } from "@emotion/react"
import type { SingleColorOptions } from "../../Theme/types"
import { getSingleColorFromPath } from "../../../utils/colors"
import type { StyledProps } from "../../../types"
import Typography from "../../Typograpy/Typogrphy"


interface StyledCalendarDateNumberButtonProps {
	dark?: boolean
	generateStateData?: GenerateStateData
	selectedBackgroundColor?: SingleColorOptions
	selectedBackgroundColorDark?: SingleColorOptions
	todayColor?: SingleColorOptions
	todayColorDark?: SingleColorOptions
}

const StyledCalendarDateNumberButton = withTheme(styled(motion.button, {
	shouldForwardProp: (props) => shouldForwardProp<StyledCalendarDateNumberButtonProps & ButtonProps>(
		[...buttonPropsArray, "generateStateData"]
	)(props as keyof StyledCalendarDateNumberButtonProps & ButtonProps)
})(({
	todayColor = "colorScheme.secondary",
	todayColorDark = "colorScheme.secondary",
	selectedBackgroundColor = "colorScheme.primary",
	selectedBackgroundColorDark = "colorScheme.primary",
	dark,
	generateStateData,
	...restProps
}: StyledCalendarDateNumberButtonProps & ButtonProps) => {
	const { theme }                           = restProps as StyledProps
	const resolvedToday                       = getSingleColorFromPath(todayColor, theme.config)
	const resolvedTodayDark                   = getSingleColorFromPath(todayColorDark, theme.config)
	const resolvedSelectedBackgroundColor     = getSingleColorFromPath(selectedBackgroundColor, theme.config)
	const resolvedSelectedBackgroundColorDark = getSingleColorFromPath(selectedBackgroundColorDark, theme.config)

	return [
		...ButtonStyles({ ...restProps, theme }) as never,

		css`
			box-shadow: none;
		`,

		generateStateData?.isToday && css`
			border: 2px solid ${resolvedToday};
		`,

		generateStateData?.isSelected && css`
			background-color: ${resolvedSelectedBackgroundColor};

			&:hover {
				background-color: ${resolvedSelectedBackgroundColor};
			}

			&:active {
				background-color: ${resolvedSelectedBackgroundColor};
			}

			&:focus {
				background-color: ${resolvedSelectedBackgroundColor};
			}
		`,

		...(dark ?? theme.isDark) ? [
			generateStateData?.isToday && css`
				border: 2px solid ${resolvedTodayDark};
			`,
			generateStateData?.isSelected && css`
				background-color: ${resolvedSelectedBackgroundColorDark};

				&:hover {
					background-color: ${resolvedSelectedBackgroundColorDark};
				}

				&:active {
					background-color: ${resolvedSelectedBackgroundColorDark};
				}

				&:focus {
					background-color: ${resolvedSelectedBackgroundColorDark};
				}
			`
		] : []
	]
}))


export type CalendarDateNumberButtonStates =
	"selected"
	| "disabled"
	| "today"
	| "inRange"
	| "inRangeStart"
	| "inRangeEnd"

export interface GenerateStateData {
	isSelected: boolean,
	isPostToday: boolean,
	isToday: boolean
}

interface CalendarDateNumberButtonProps extends ComponentProps<typeof Button> {
	day: number
	notInMonth?: boolean
	// state?: CalendarDateNumberButtonStates | CalendarDateNumberButtonProps[]
	isInSelectedRange?: boolean
	generateStateData?: GenerateStateData
}

const CalendarDateNumberButton = (
	{
		day,
		notInMonth,
		generateStateData,
		isInSelectedRange,
		...restProps
	}: CalendarDateNumberButtonProps) => {
	return (
		<StyledCalendarDateNumberButton className="!rounded-full z-[10]"
		                                colorsForStates="accent"
		                                colorsForStatesDark="overlaysDark"
		                                initial={false}
		                                generateStateData={generateStateData}
		                                width="30px"
		                                height="30px"
		                                noPadding
		                                {...restProps}>
			<Typography className="text-center"
			            variant="small"
			            color={(notInMonth && !generateStateData?.isSelected && !isInSelectedRange) ? "colorScheme.subtitle2" : generateStateData?.isSelected ? "colorScheme.light" : "colorScheme.header2"}
			            colorDark={(notInMonth && !generateStateData?.isSelected && !isInSelectedRange) ? "colorScheme.subtitle3" : "colorScheme.light"}>
				{day}
			</Typography>
		</StyledCalendarDateNumberButton>
	)
}

export default CalendarDateNumberButton
