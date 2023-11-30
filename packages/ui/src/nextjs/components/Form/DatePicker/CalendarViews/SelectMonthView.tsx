import _ from "lodash"
import moment from "moment"
import CalendarMonthButton from "../CalendarMonthButton"
import { ValueOptions } from "../CalendarDatePickerWithoutState"
import Col from "../../../Grid/Col"
import Row from "../../../Grid/Row"

const monthsMap = {
	1:  "January",
	2:  "February",
	3:  "March",
	4:  "April",
	5:  "May",
	6:  "June",
	7:  "July",
	8:  "August",
	9:  "September",
	10: "October",
	11: "November",
	12: "December",
} as const

interface SelectMonthViewProps {
	selectedDate?: ValueOptions
	yearInView?: number
	min?: moment.MomentInput
	max?: moment.MomentInput
	onSelect?: (month: number) => void
}


const SelectMonthView = ({ onSelect, yearInView, selectedDate, min, max }: SelectMonthViewProps) => {
	return (
		<Col className="space-y-4 pt-4">
			{_ (monthsMap).keys ().chunk (3).map ((monthsRow, index) => (
				<Row className="justify-between" key={index}>
					{monthsRow.map ((month) => {
						return (
							<CalendarMonthButton month={Number(month)}
							                     min={min}
							                     max={max}
							                     yearInView={yearInView}
							                     selectedDate={selectedDate}
							                     onClick={() => onSelect?. (Number (month))}
							                     key={month}/>
						)
					})}
				</Row>
			)).value ()}
		</Col>
	)
}

export default SelectMonthView
