import type { CalendarDatePickerProps } from "./CalendarDatePickerWithoutState";
import CalendarDatePickerWithoutState from "./CalendarDatePickerWithoutState"
import useCalendarDatePicketState from "./useCalendarDatePicketState"
import type moment from "moment"

interface CalendarWithStateDatePickerProps {
	initialDate?: moment.MomentInput
}

const CalendarDatePicker = <IsRange extends boolean>(
	{
		initialDate,
		...restProps
	}: CalendarWithStateDatePickerProps & CalendarDatePickerProps<IsRange>) => {
	const calendarState = useCalendarDatePicketState ({ initialDate })

	return (
		<CalendarDatePickerWithoutState
			{...calendarState}
			{...restProps}/>
	)
}

export default CalendarDatePicker
