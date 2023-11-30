import { useCallback, useState } from "react"
import moment from "moment/moment"
import type { Value, ValueOptions } from "./CalendarDatePickerWithoutState"
import { getDateMonth, getDateYear } from "./helpers"

interface UseCalendarDatePicketStateProps {
	initialDate?: Value | [Value, Value]
}

const useCalendarDatePicketState = ({ initialDate }: UseCalendarDatePicketStateProps = {}) => {
	const [visibleView, setVisibleView] = useState<"month" | "selectMonth" | "selectYear"> ("month")
	const [yearInView, setYearInView] = useState<number> (Array.isArray (initialDate) ? getDateYear (initialDate[1]) : getDateYear (initialDate))
	const [monthInView, setMonthInView] = useState<number> (Array.isArray (initialDate) ? getDateMonth (initialDate[1]) : getDateMonth (initialDate))
	const getCurrentDateInView = useCallback (() => {
		return moment (`${monthInView}-01-${yearInView}`, "MM-DD-YYYY").format ("MM-DD-YYYY")
	}, [monthInView, yearInView]);

	const updateStateByDate = (date: moment.Moment) => {
		setMonthInView (getDateMonth (date))
		setYearInView (getDateYear (date))
	}

	return {
		visibleView,
		setVisibleView,
		yearInView,
		setYearInView,
		monthInView,
		setMonthInView,
		getCurrentDateInView,
		updateStateByDate
	}
}

export default useCalendarDatePicketState
