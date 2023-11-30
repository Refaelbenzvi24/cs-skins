import { StyledCalendarTextButton } from "./CalendarViews/SelectYearView"
import moment from "moment/moment"
import { DATE_MONTH_DAY_YEAR_FORMAT } from "./helpers"
import type { ComponentProps } from "react"
import { useMemo } from "react"
import { ValueOptions } from "./CalendarDatePickerWithoutState"
import { useMain } from "../../../index"
import Typography from "../../Typograpy/Typogrphy"
import Col from "../../Grid/Col"
import _ from "lodash"

interface CalendarMonthButtonProps extends ComponentProps<typeof StyledCalendarTextButton> {
	month: number
	max?: moment.MomentInput,
	min?: moment.MomentInput,
	yearInView?: number,
	selectedDate?: ValueOptions
}

const checkIfSelected = (month: number, yearInView?: number, selectedDate?: ValueOptions) => {
	if (!selectedDate) return false
	if (_.isArray (selectedDate) && selectedDate.length === 2) {
		const [start, end] = selectedDate
		const isInFirstMonth = moment (start).isSame (moment (`${month}-01-${yearInView}`, "MM-DD-YYYY"), "month")
		const isInLastMonth = moment (end).isSame (moment (`${month}-01-${yearInView}`, "MM-DD-YYYY"), "month")
		return isInFirstMonth || isInLastMonth
	}
	if (!Array.isArray (selectedDate)) return moment (selectedDate).isSame (moment (`${month}-01-${yearInView}`, "MM-DD-YYYY"), "month")
	return false
}
const CalendarMonthButton = (
	{
		month,
		max,
		min,
		yearInView,
		selectedDate,
		...restProps
	}: CalendarMonthButtonProps) => {
	const { t } = useMain ()
	const isInRange = useMemo (() => {
		if (!max && !min) return true
		if (max && min) return moment (`${month}-01-${yearInView}`, "MM-DD-YYYY").isBetween (min, max, "month", "[]")
		if (max) return moment (`${month}-01-${yearInView}`, "MM-DD-YYYY").isBefore (max, "month")
		if (min) return moment (`${month}-01-${yearInView}`, "MM-DD-YYYY").isAfter (min, "month")
		return false
	}, [max, min, month, yearInView])
	const isCurrent = useMemo (() => month === (moment ().month () + 1) && yearInView === moment ().year (), [month, yearInView])
	const isSelected = useMemo (() => checkIfSelected (month, yearInView, selectedDate), [month, selectedDate, yearInView])
	const isInSelectedRange = useMemo (() => _.isArray (selectedDate) && selectedDate.length === 2 ? moment (`${month}-01-${yearInView}`, DATE_MONTH_DAY_YEAR_FORMAT).isBetween (selectedDate[0], selectedDate[1], "month", "[]") : false, [month, selectedDate, yearInView])

	return (
		<Col>
			<StyledCalendarTextButton className="py-[4px]"
			                          colorsForStates="accent"
			                          colorsForStatesDark="overlaysDark"
			                          isCurrent={isCurrent}
			                          elevation={0}
			                          noPadding
			                          disabled={!isInRange}
			                          width="90px"
			                          {...restProps}>
				<Typography variant="small"
				            color={isSelected ? "colorScheme.primary" : isInSelectedRange ? "colorScheme.primaryLight2" : "colorScheme.header1"}
				            colorDark={isSelected ? "colorScheme.primary" : isInSelectedRange ? "colorScheme.primaryLight2" : "colorScheme.light"}>
					{t ? t (`ui:calendar.months.${month}`) : month}
				</Typography>
			</StyledCalendarTextButton>
		</Col>
	)
}

export default CalendarMonthButton
