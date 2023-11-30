import MonthHeader from "./CalendarHeaders/MonthHeader"
import MonthView from "./CalendarViews/MonthView"
import SelectMonthView from "./CalendarViews/SelectMonthView"
import YearHeader from "./CalendarHeaders/YearHeader"
import SelectYearView from "./CalendarViews/SelectYearView"
import moment from "moment"
import type { DateLimitations, generateCalendarMonthDaysList } from "./helpers";
import { DATE_MONTH_DAY_YEAR_FORMAT, getNextMonth, getNextYear, getPrevMonth, getPrevYear } from "./helpers"
import type useCalendarDatePicketState from "./useCalendarDatePicketState"
import Col from "../../Grid/Col"
import Row from "../../Grid/Row"
import Divider from "../../Dividers/Divider"
import Button from "../../Buttons/Button"
import Typography from "../../Typograpy/Typogrphy"
import { useMain } from "../../../index"
import _ from "lodash"


export type Value = moment.MomentInput
export type RangeValue = [moment.MomentInput] | [moment.MomentInput, moment.MomentInput]
export type ValueOptions = Value | RangeValue

export interface CalendarDatePickerProps<IsRange extends boolean> extends DateLimitations {
	isRange: IsRange
	hideBottomActions?: boolean
	value: IsRange extends true ? RangeValue : Value
	onChange: (date: IsRange extends true ? RangeValue : Value) => void
	onClear?: () => void
	onDone?: () => void
}

const   CalendarDatePickerWithoutState = <IsRange extends boolean>(
	{
		value,
		hideBottomActions,
		onDone,
		onClear,
		onChange,
		isRange,
		disallowedDates,
		allowedDates,
		min,
		max,
		visibleView,
		setVisibleView,
		setMonthInView,
		updateStateByDate,
		getCurrentDateInView,
		yearInView,
		monthInView,
		setYearInView
	}: CalendarDatePickerProps<IsRange> & ReturnType<typeof useCalendarDatePicketState>) => {
	const { t } = useMain ()

	const handleMonthViewSelect = ({ date }: ReturnType<typeof generateCalendarMonthDaysList>[number]) => {
		if (onChange) {
			if (isRange) {
				if (!value) return onChange ([moment (date).format (DATE_MONTH_DAY_YEAR_FORMAT)])
				if (value && _.isArray (value) && value.length === 0) return onChange ([moment (date).format (DATE_MONTH_DAY_YEAR_FORMAT)])

				if (value && _.isArray (value) && value.length === 1) {
					const [firstDate] = value
					const firstDateMoment = moment (firstDate)
					const dateMoment = moment (date)

					if (dateMoment.isSame (firstDateMoment)) return onChange ([moment (date).format (DATE_MONTH_DAY_YEAR_FORMAT)])
					if (dateMoment.isBefore (firstDateMoment)) return onChange ([moment (date).format (DATE_MONTH_DAY_YEAR_FORMAT), firstDateMoment.format (DATE_MONTH_DAY_YEAR_FORMAT)])
					if (dateMoment.isAfter (firstDateMoment)) return onChange ([firstDateMoment.format (DATE_MONTH_DAY_YEAR_FORMAT), moment (date).format (DATE_MONTH_DAY_YEAR_FORMAT)])
				}

				if (value && _.isArray (value) && value.length === 2) return onChange ([moment (date).format (DATE_MONTH_DAY_YEAR_FORMAT)])
			}

			if (!isRange) {
				onChange (moment (date).format (DATE_MONTH_DAY_YEAR_FORMAT) as unknown as IsRange extends true ? RangeValue : Value)
			}
		}
	}

	return (
		<>
			<Col>
				<Col className="px-6">
					{visibleView === "month" && (
						<MonthHeader
							month={monthInView}
							year={yearInView}
							onNextMonthClick={() => updateStateByDate (getNextMonth (getCurrentDateInView ()))}
							onPrevMonthClick={() => updateStateByDate (getPrevMonth (getCurrentDateInView ()))}
							onMonthClick={() => setVisibleView ("selectMonth")}/>
					)}
					{visibleView === "selectMonth" && (
						<YearHeader
							value={yearInView}
							onNextYearClick={() => updateStateByDate (getNextYear (getCurrentDateInView ()))}
							onPrevYearClick={() => updateStateByDate (getPrevYear (getCurrentDateInView ()))}
							onYearClick={() => setVisibleView ("selectYear")}/>
					)}
				</Col>

				<Col className="px-6 max-h-[350px] overflow-y-auto overflow-x-hidden">
					{visibleView === "month" && (
						<MonthView
							isRange={isRange ?? false}
							selectedDate={value}
							year={yearInView}
							month={monthInView}
							allowedDates={allowedDates}
							disallowedDates={disallowedDates}
							max={max}
							min={min}
							onSelect={handleMonthViewSelect}/>
					)}
					{visibleView === "selectMonth" && (
						<SelectMonthView
							selectedDate={value}
							yearInView={yearInView}
							max={max}
							min={min}
							onSelect={(month) => {
								setMonthInView (month)
								setVisibleView ("month")
							}}/>
					)}
					{visibleView === "selectYear" && (
						<SelectYearView
							selectedDate={value}
							max={max}
							min={min}
							onSelect={(year) => {
								setYearInView (year)
								setVisibleView ("selectMonth")
							}}/>
					)}
				</Col>
			</Col>

			{!hideBottomActions && (
				<Col>
					<Row className="pt-5">
						<Divider color="colorScheme.subtitle2" colorDark="colorScheme.body1"
						         opacity="40%"/>
					</Row>
					<Col className="px-6 pt-4 pb-5">
						<Row className="space-s-4 justify-end">
							<Button
								onClick={onClear}
								colorsForStates="subtitle3"
								colorsForStatesDark="body2">
								<Typography color="colorScheme.light" colorDark="colorScheme.light"
								            variant="body">
									{t ? t ("ui:calendar.clear") : "Clear"}
								</Typography>
							</Button>

							<Button className="px-14"
							        onClick={onDone}
							        noPadding>
								<Typography color="colorScheme.light" colorDark="colorScheme.light"
								            variant="body">
									{t ? t ("ui:calendar.done") : "Done"}
								</Typography>
							</Button>
						</Row>
					</Col>
				</Col>
			)}
		</>
	)
}

export default CalendarDatePickerWithoutState
