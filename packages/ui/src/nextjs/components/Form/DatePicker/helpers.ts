import moment from "moment/moment"
import _ from "lodash"


export const DATE_MONTH_DAY_YEAR_FORMAT = "MM-DD-YYYY" as const

export interface DateLimitations {
	allowedDates?: moment.MomentInput[]
	disallowedDates?: moment.MomentInput[]
	min?: moment.MomentInput
	max?: moment.MomentInput
}

export const getDateDay              = (date?: moment.MomentInput) => moment(date).date()
export const getDateMonth            = (date?: moment.MomentInput) => (moment(date).month() + 1)
export const getDateYear             = (date?: moment.MomentInput) => moment(date).year()
export const getNextMonth            = (date: moment.MomentInput, format?: moment.MomentFormatSpecification) => moment(date, format).add(1, "month")
export const getPrevMonth            = (date: moment.MomentInput, format?: moment.MomentFormatSpecification) => moment(date, format).subtract(1, "month")
export const getNextYear             = (date: moment.MomentInput) => moment(date).add(1, "year")
export const getPrevYear             = (date: moment.MomentInput) => moment(date).subtract(1, "year")
export const checkIfDateIsAllowed    = (date: moment.MomentInput, allowedDates: moment.MomentInput[]) => allowedDates.some((allowedDate) => moment(date).isSame(allowedDate, "day"))
export const checkIfDateIsDisallowed = (date: moment.MomentInput, disallowedDates: moment.MomentInput[]) => disallowedDates.some((disallowedDate) => moment(date).isSame(disallowedDate, "day"))
export const checkIfDateIsMin        = (date: moment.MomentInput, min: moment.MomentInput) => moment(date).isSameOrAfter(min, "day")
export const checkIfDateIsMax        = (date: moment.MomentInput, max: moment.MomentInput) => moment(date).isSameOrBefore(max, "day")
export const checkIfYearIsMin        = (date: moment.MomentInput, min: moment.MomentInput) => moment(date).isAfter(min, "year")
export const checkIfYearIsMax        = (date: moment.MomentInput, max: moment.MomentInput) => moment(date).isBefore(max, "year")

export const isInAllowedDates = (date: moment.MomentInput, dateLimitations: DateLimitations) => {
	const limitationsChecks = [
		...(dateLimitations.allowedDates ? [checkIfDateIsAllowed(date, dateLimitations.allowedDates)] : []),
		...(dateLimitations.disallowedDates ? [!checkIfDateIsDisallowed(date, dateLimitations.disallowedDates)] : []),
		...(dateLimitations.min ? [checkIfDateIsMin(date, dateLimitations.min)] : []),
		...(dateLimitations.max ? [checkIfDateIsMax(date, dateLimitations.max)] : [])
	]
	return limitationsChecks.every((check) => check)
}

export const getAmountOfDaysInMonth = (month: number, year: number) => {
	return moment(`${year}-${month}-01`).daysInMonth()
}

export const getFirstDayInMonth = (month: number, year: number) => {
	return moment(`${year}-${month}-01`).day()
}

interface GenerateCalendarMonthDaysListParams extends DateLimitations {
	selectedDate?: moment.MomentInput | [moment.MomentInput] | [moment.MomentInput, moment.MomentInput]
	daysInMonth: number
	firstDayInMonth: number
	lastMonthDays: number
	month: number
	year: number
}

const getIsSelected = (date: moment.MomentInput, selectedDate?: moment.MomentInput | [moment.MomentInput] | [moment.MomentInput, moment.MomentInput]) => {
	if (!selectedDate) return undefined
	if(_.isArray(selectedDate)){
		return selectedDate.some((selectedDateItem) => moment(selectedDateItem).isSame(date, "day"))
	}
	return moment(selectedDate).isSame(date, "day")
}

const checkIfDateIsInSelectedRange = (date: moment.MomentInput, selectedDate?: moment.MomentInput | [moment.MomentInput] | [moment.MomentInput, moment.MomentInput]) => {
	if (!selectedDate) return false
	if (_.isArray(selectedDate) && selectedDate.length === 2) {
		return moment(date).isBetween(selectedDate[0], selectedDate[1], "day", "[]")
	}
	return false
}

export const generateCalendarMonthDaysList = (
	{
		selectedDate,
		daysInMonth,
		firstDayInMonth,
		lastMonthDays,
		month,
		year,
		disallowedDates,
		max,
		min,
		allowedDates
	}: GenerateCalendarMonthDaysListParams) => {
	const today               = moment()
	const inMonthDate         = moment(`${month}-01-${year}`, DATE_MONTH_DAY_YEAR_FORMAT)
	const prevMonthDate       = getPrevMonth(inMonthDate)
	const nextMonthDate       = getNextMonth(inMonthDate)
	const monthBeforeDaysList = Array.from({ length: firstDayInMonth }, (_, index) => {
		const date = moment(`${prevMonthDate.month() + 1}-${lastMonthDays - index}-${prevMonthDate.year()}`, DATE_MONTH_DAY_YEAR_FORMAT)
		const isSelected = getIsSelected(date, selectedDate)
		const isInSelectedRange = checkIfDateIsInSelectedRange(date, selectedDate)
		const isFirstInRange = Array.isArray(selectedDate) && selectedDate.length === 2 ? moment(date).isSame(selectedDate[0], "day") : false
		const isSecondInRange = Array.isArray(selectedDate) && selectedDate.length === 2 ? moment(date).isSame(selectedDate[1], "day") : false
		return {
			date:        date.format(DATE_MONTH_DAY_YEAR_FORMAT),
			day:         lastMonthDays - index,
			notInMonth:  true,
			isPostToday: date.isAfter(today),
			isToday:     date.isSame(today, "day"),
			disabled:    !isInAllowedDates(date, { allowedDates, disallowedDates, min, max }),
			isFirstInRange,
			isSecondInRange,
			isInSelectedRange,
			...(isSelected ? { isSelected } : {})
		}
	})

	const currentMonthDaysList = Array.from({ length: daysInMonth }, (_d, index) => {
		const date = moment(`${month}-${index + 1}-${year}`, DATE_MONTH_DAY_YEAR_FORMAT)
		const isSelected = getIsSelected(date, selectedDate)
		const isInSelectedRange = checkIfDateIsInSelectedRange(date, selectedDate)
		const isFirstInRange = Array.isArray(selectedDate) && selectedDate.length === 2 ? moment(date).isSame(selectedDate[0], "day") : false
		const isSecondInRange = Array.isArray(selectedDate) && selectedDate.length === 2 ? moment(date).isSame(selectedDate[1], "day") : false
		return {
			date:        date.format(DATE_MONTH_DAY_YEAR_FORMAT),
			day:         index + 1,
			notInMonth:  false,
			isPostToday: date.isAfter(today),
			isToday:     date.isSame(today, "day"),
			disabled:    !isInAllowedDates(date, { allowedDates, disallowedDates, min, max }),
			isFirstInRange,
			isSecondInRange,
			isInSelectedRange,
			...(isSelected ? { isSelected } : {})
		}
	})

	const nextMonthDaysList = Array.from({ length: (daysInMonth + firstDayInMonth) > 35 ? 42 - (daysInMonth + firstDayInMonth) : 35 - (daysInMonth + firstDayInMonth) }, (_, index) => {
		const date = moment(`${nextMonthDate.month() + 1}-${index + 1}-${nextMonthDate.year()}`, DATE_MONTH_DAY_YEAR_FORMAT)
		const isSelected = getIsSelected(date, selectedDate)
		const isInSelectedRange = checkIfDateIsInSelectedRange(date, selectedDate)
		const isFirstInRange = Array.isArray(selectedDate) && selectedDate.length === 2 ? moment(date).isSame(selectedDate[0], "day") : false
		const isSecondInRange = Array.isArray(selectedDate) && selectedDate.length === 2 ? moment(date).isSame(selectedDate[1], "day") : false
		return {
			date:        date.format(DATE_MONTH_DAY_YEAR_FORMAT),
			day:         index + 1,
			notInMonth:  true,
			isPostToday: date.isAfter(today),
			isToday:     date.isSame(today, "day"),
			disabled:    !isInAllowedDates(date, { allowedDates, disallowedDates, min, max }),
			isFirstInRange,
			isSecondInRange,
			isInSelectedRange,
			...(isSelected ? { isSelected } : {})
		}
	})

	return [...(monthBeforeDaysList.reverse()), ...currentMonthDaysList, ...nextMonthDaysList]
}

export const rangesOptionsTemplate = [
	{
		label:        "This week",
		value:        "thisWeek",
	},
	{
		label:        "This month",
		value:        "thisMonth",
	},
	{
		label:        "This quarter",
		value:        "thisQuarter",
	},
	{
		label:         "This year",
		value:         "thisYear",
		bottomDivider: true
	},
	{
		label:        "Last Week",
		value:        "lastWeek",
	},
	{
		label:        "Last month",
		value:        "lastMonth",
	},
	{
		label:        "Last quarter",
		value:        "lastQuarter",
	},
	{
		label:         "Last year",
		value:         "lastYear",
		bottomDivider: true
	},
	{
		label:        "Last 30 days",
		value:        "last30Days",
	},
	{
		label:        "Last 90 days",
		value:        "last90Days",
	},
	{
		label:        "Last 365 days",
		value:        "last365Days",
	}
] as const

const rangesMap = {
	thisWeek: (startFormat: string, endFormat: string) => ({
		start: moment().startOf('week').format(startFormat),
		end:   moment().endOf('week').format(endFormat),
	}),
	thisMonth: (startFormat: string, endFormat: string) => ({
		start: moment().startOf('month').format(startFormat),
		end:   moment().endOf('month').format(endFormat),
	}),
	thisQuarter: (startFormat: string, endFormat: string) => ({
		start: moment().startOf('quarter').format(startFormat),
		end:   moment().endOf('quarter').format(endFormat),
	}),
	thisYear: (startFormat: string, endFormat: string) => ({
		start: moment().startOf('year').format(startFormat),
		end:   moment().endOf('year').format(endFormat),
	}),
	lastWeek: (startFormat: string, endFormat: string) => ({
		start: moment().subtract(1, 'week').startOf('week').format(startFormat),
		end:   moment().subtract(1, 'week').endOf('week').format(endFormat),
	}),
	lastMonth: (startFormat: string, endFormat: string) => ({
		start: moment().subtract(1, 'month').startOf('month').format(startFormat),
		end:   moment().subtract(1, 'month').endOf('month').format(endFormat),
	}),
	lastQuarter: (startFormat: string, endFormat: string) => ({
		start: moment().subtract(1, 'quarter').startOf('quarter').format(startFormat),
		end:   moment().subtract(1, 'quarter').endOf('quarter').format(endFormat),
	}),
	lastYear: (startFormat: string, endFormat: string) => ({
		start: moment().subtract(1, 'year').startOf('year').format(startFormat),
		end:   moment().subtract(1, 'year').endOf('year').format(endFormat),
	}),
	last30Days: (startFormat: string, endFormat: string) => ({
		start: moment().subtract(30, 'days').format(startFormat),
		end:   moment().format(endFormat),
	}),
	last90Days: (startFormat: string, endFormat: string) => ({
		start: moment().subtract(90, 'days').format(startFormat),
		end:   moment().format(endFormat),
	}),
	last365Days: (startFormat: string, endFormat: string) => ({
		start: moment().subtract(365, 'days').format(startFormat),
		end:   moment().format(endFormat),
	}),
} as const

export const getRangeByType = (type: keyof typeof rangesMap, startFormat: string = DATE_MONTH_DAY_YEAR_FORMAT, endFormat: string = DATE_MONTH_DAY_YEAR_FORMAT) => {
	return rangesMap[type](startFormat, endFormat)
}

export const getRangeOptions = () => {
	return rangesOptionsTemplate.map(({ label, value, ...restOptionFields }) => {
		const extraDetailsRange = getRangeByType(value, "DD MMM", "DD MMM, YYYY")
		const ranges = getRangeByType(value)
		return {
			...restOptionFields,
			label,
			value,
			extraDetails: `${extraDetailsRange.start} - ${extraDetailsRange.end}`,
			range: [ranges.start, ranges.end]
		}
	})
}
