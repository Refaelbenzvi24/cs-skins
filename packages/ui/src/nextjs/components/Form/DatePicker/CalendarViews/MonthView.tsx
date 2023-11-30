import CalendarDateNumberButton from "../CalendarDateNumberButton"
import { useMemo } from "react"
import type { DateLimitations } from "../helpers";
import { generateCalendarMonthDaysList, getAmountOfDaysInMonth, getFirstDayInMonth } from "../helpers"
import { daysMap } from "../constants"
import moment from "moment"
import _ from "lodash"
import clsx from "clsx"
import { RangeValue, Value } from "../CalendarDatePickerWithoutState"
import { useMain } from "../../../../index"
import Col from "../../../Grid/Col"
import Row from "../../../Grid/Row"
import Card from "../../../Cards/Card"
import Typography from "../../../Typograpy/Typogrphy"


interface MonthViewProps<IsRange extends boolean> extends DateLimitations {
	month: number
	year: number
	isRange: IsRange
	selectedDate: IsRange extends true ? RangeValue : Value
	onSelect?: (date: ReturnType<typeof generateCalendarMonthDaysList>[number]) => void
	onDayChange?: (day: ReturnType<typeof generateCalendarMonthDaysList>[number]) => void
	onMonthChange?: (month: ReturnType<typeof generateCalendarMonthDaysList>[number]) => void
	onYearChange?: (year: ReturnType<typeof generateCalendarMonthDaysList>[number]) => void
}

const MonthView = <IsRange extends boolean>(
	{
		month,
		year,
		selectedDate,
		onSelect,
		onMonthChange,
		onYearChange,
		onDayChange,
		max,
		min,
		disallowedDates,
		allowedDates
	}: MonthViewProps<IsRange>) => {
	const { t } = useMain ()

	const daysInMonth = useMemo (() => getAmountOfDaysInMonth (month, year), [month, year]);
	const firstDayInMonth = useMemo (() => getFirstDayInMonth (month, year), [month, year]);
	const lastMonthDays = useMemo (() => getAmountOfDaysInMonth (month === 1 ? 12 : month - 1, month === 1 ? year - 1 : year), [month, year]);
	const calendarMonthDaysList = useMemo (
		() => generateCalendarMonthDaysList ({
			daysInMonth, firstDayInMonth, lastMonthDays, month, year, min, max, disallowedDates, allowedDates, selectedDate
		}),
		[daysInMonth, firstDayInMonth, lastMonthDays, month, year, min, max, disallowedDates, allowedDates, selectedDate]);

	const handleDateNumberButtonClick = (dayData: typeof calendarMonthDaysList[number]) => {
		if (onSelect) onSelect (dayData)
		if (onDayChange) onDayChange (dayData)
		if (onMonthChange && dayData.notInMonth) onMonthChange (dayData)
		if (onYearChange && !moment (dayData.date).isSame (moment (), "year")) onYearChange (dayData)
	}

	return (
		<Col>
			<Row className="py-2 justify-between items-center">
				{Object.keys (daysMap).map ((day) => (
					<Card className="flex !rounded-full justify-center items-center text-center"
					      height="28px"
					      width="28px"
					      backgroundColor="colorScheme.subtitle2"
					      backgroundColorDark="colorScheme.body1"
					      elevation={0}
					      noPadding
					      key={day}>
						<Typography className="text-center"
						            variant="button"
						            weight={400}
						            size={0.775}
						            color="colorScheme.white"
						            colorDark="colorScheme.subtitle2">
							{t ? t (`ui:calendar.days.short.${day}`) : daysMap[day as keyof typeof daysMap]}
						</Typography>
					</Card>
				))}
			</Row>

			{_.chunk (calendarMonthDaysList, 7).map ((week, _index) => (
				<Row className="py-2 items-center" key={`${month}-${_index}`}>
					{week.map ((dayData, index) => {
						const { day, notInMonth, isPostToday, isToday, isSelected, disabled, isInSelectedRange, isFirstInRange, isSecondInRange } = dayData
						return (
							<Row
								className={`relative w-full items-center justify-center ${clsx (isSelected ? "justify-start" : "")}`}
								key={`${month}-${day}-${year}`}>
								<CalendarDateNumberButton day={day}
								                          onClick={() => {
									                          handleDateNumberButtonClick (dayData)
								                          }}
								                          disabled={disabled}
								                          colorsForStates={isInSelectedRange ? "primaryLight" : "accent"}
								                          colorsForStatesDark={isInSelectedRange ? "body1" : "overlaysDark"}
								                          isInSelectedRange={isInSelectedRange}
								                          notInMonth={notInMonth}
								                          generateStateData={{
									                          isPostToday,
									                          isToday,
									                          isSelected: isSelected ?? false
								                          }}/>
								{isInSelectedRange && (
									<Card
										className={`flex absolute z-[0] ${clsx (isFirstInRange ? "right-0" : (isSecondInRange ? "left-0" : ""))} ${clsx ((index === 6 && !isSecondInRange && !isFirstInRange) ? "rounded-r-xl" : "")} ${clsx ((index === 0 && !isSecondInRange && !isFirstInRange) ? "rounded-l-xl" : "")}`}
										elevation={0}
										backgroundColor="colorScheme.primaryLight"
										backgroundColorDark="colorScheme.body1"
										width={isSelected ? "50%" : "100%"}
										height="100%"
										notRounded
										noPadding/>
								)}
							</Row>
						)
					})}
				</Row>
			))}
		</Col>
	)
}

export default MonthView
