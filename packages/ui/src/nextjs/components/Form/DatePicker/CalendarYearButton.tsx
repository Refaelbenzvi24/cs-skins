import moment from "moment/moment"
import { StyledCalendarTextButton } from "./CalendarViews/SelectYearView"
import type { ComponentProps} from "react";
import { forwardRef, useMemo } from "react"
import type { ValueOptions } from "./CalendarDatePickerWithoutState"
import Col from "../../Grid/Col"
import Typography from "../../Typograpy/Typogrphy"
import _ from "lodash"

interface CalendarYearButtonProps extends ComponentProps<typeof StyledCalendarTextButton> {
	selectedDate?: ValueOptions
	year: number
	min?: moment.MomentInput
	max?: moment.MomentInput
}

const CalendarYearButton = forwardRef<HTMLDivElement, CalendarYearButtonProps> ((
	{
		selectedDate,
		year,
		min,
		max,
		...restProps
	}, ref) => {
	const isCurrent = useMemo (() => year === moment ().year (), [year])
	const isInDisabledRange = useMemo(() => {
		if (!max && !min) return true
		if (max && min) return moment (`01-01-${year}`, "MM-DD-YYYY").isBetween (min, max, "year", "[]")
		if (max) return moment (`01-01-${year}`, "MM-DD-YYYY").isBefore (max, "year")
		if (min) return moment (`01-01-${year}`, "MM-DD-YYYY").isAfter (min, "year")
	}, [max, min, year])
	const isSelected = useMemo (() => {
		if (!selectedDate) return false
		if (Array.isArray(selectedDate) && selectedDate.length === 2) {
			const [start, end] = selectedDate
			const isInFirstMonth = moment (start).isSame (moment (`01-01-${year}`, "MM-DD-YYYY"), "year")
			const isInLastMonth = moment (end).isSame (moment (`01-01-${year}`, "MM-DD-YYYY"), "year")
			return isInFirstMonth || isInLastMonth
		}
		if (!Array.isArray(selectedDate)) return moment (selectedDate).isSame (moment (`01-01-${year}`, "MM-DD-YYYY"), "year")
		return false
	}, [selectedDate, year])
	const isInSelectedRange = useMemo (() => _.isArray (selectedDate) && selectedDate.length === 2 ? moment (`01-01-${year}`, "MM-DD-YYYY").isBetween (selectedDate[0], selectedDate[1], "year", "[]") : false, [selectedDate, year])

	return (
		<Col ref={ref}>
			<StyledCalendarTextButton className="py-[4px]"
			                          isCurrent={isCurrent}
			                          colorsForStates="accent"
			                          colorsForStatesDark="overlaysDark"
			                          disabled={!isInDisabledRange}
			                          elevation={0}
			                          noPadding
			                          width="70px"
			                          {...restProps}>
				<Typography variant="small"
				            color={isSelected ? "colorScheme.primary" : isInSelectedRange ? "colorScheme.primaryLight2" :"colorScheme.header1"}
				            colorDark={isSelected ? "colorScheme.primary" : isInSelectedRange ? "colorScheme.primaryLight2" : "colorScheme.light"}>
					{year}
				</Typography>
			</StyledCalendarTextButton>
		</Col>
	)
})

export default CalendarYearButton
