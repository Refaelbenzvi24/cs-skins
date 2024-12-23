interface GetIntervalProps {
	minutes?: number
	hours?: number
	dayOfMonth?: number
	month?: number
	dayOfWeek?: number
}

export const getIntervalInMilliseconds = ({
		minutes = 0,
		hours = 0,
		days = 0,
		weeks = 0
	}: { days?: number, weeks?: number } & Omit<GetIntervalProps, "dayOfWeek" | "dayOfMonth" | "month">) => {
	const minutesInMilis = minutes * 60 * 1000
	const hoursInMilis = hours * 60 * 60 * 1000
	const daysInMilis = days * 60 * 60 * 24 * 1000
	const weeksInMilis = weeks * 60 * 60 * 24 * 7 * 1000

	return minutesInMilis + hoursInMilis + daysInMilis + weeksInMilis
}

export const getIntervalInSeconds = (
	{
		minutes = 0,
		hours = 0,
		days = 0,
		weeks = 0
	}: { days?: number, weeks?: number } & Omit<GetIntervalProps, "dayOfWeek" | "dayOfMonth" | "month">) => {
	const minutesInSec = minutes * 60
	const hoursInSec = hours * 60 * 60
	const daysInSec = days * 60 * 60 * 24
	const weeksInSec = weeks * 60 * 60 * 24 * 7

	return minutesInSec + hoursInSec + daysInSec + weeksInSec
}

export const getCronIntervalString = ({minutes, month, dayOfMonth, dayOfWeek, hours}: GetIntervalProps) => {
	const minutesString = minutes ? `*/${minutes}` : "*"
	const monthString = month ? `*/${month}` : "*"
	const dayOfMonthString = dayOfMonth ? `*/${dayOfMonth}` : "*"
	const dayOfWeekString = dayOfWeek ? `*/${dayOfWeek}` : "*"
	const hoursString = hours ? `*/${hours}` : "*"

	return `${minutesString} ${hoursString} ${dayOfMonthString} ${monthString} ${dayOfWeekString}`
}
