import _ from "lodash"
import { yearsList } from "../constants"
import { useEffect, useMemo, useRef } from "react"
import moment from "moment"
import styled from "@emotion/styled"
import { motion } from "framer-motion"
import { css, withTheme } from "@emotion/react"
import CalendarYearButton from "../CalendarYearButton"
import { mergeRefs } from "react-merge-refs"
import { ValueOptions } from "../CalendarDatePickerWithoutState"
import { SingleColorOptions } from "../../../Theme/types"
import { shouldForwardProp } from "../../../../utils/StyledUtils"
import { ButtonProps, buttonPropsArray, ButtonStyles } from "../../../Buttons/Button"
import { StyledProps } from "../../../../types"
import { getSingleColorFromPath } from "../../../../utils/colors"
import Col from "../../../Grid/Col"
import Row from "../../../Grid/Row"


interface StyledCalendarMonthButtonProp {
	currentColor?: SingleColorOptions
	currentColorDark?: SingleColorOptions
	isCurrent?: boolean
	dark?: boolean
}

export const StyledCalendarTextButton = withTheme(styled(motion.button, {
	shouldForwardProp: (props) => shouldForwardProp<StyledCalendarMonthButtonProp & ButtonProps>(
		[...buttonPropsArray, "isCurrent", "currentColor", "currentColorDark"],
	)(props as keyof StyledCalendarMonthButtonProp & ButtonProps)
})(({
	currentColor = "colorScheme.secondary",
	currentColorDark = "colorScheme.secondary",
	isCurrent,
	dark,
	...restProps
}: StyledCalendarMonthButtonProp & ButtonProps) => {
	const { theme }         = restProps as StyledProps
	const resolvedToday     = getSingleColorFromPath(currentColor, theme.config)
	const resolvedTodayDark = getSingleColorFromPath(currentColorDark, theme.config)

	return [
		...ButtonStyles({ ...restProps, theme }) as never,

		css`
			box-shadow: none;
		`,

		isCurrent && css`
			border: 2px solid ${resolvedToday};
		`,

		...(dark ?? theme.isDark) ? [
			isCurrent && css`
				border: 2px solid ${resolvedTodayDark};
			`
		] : []
	]
}))

interface SelectYearViewProps {
	selectedDate: ValueOptions
	onSelect?: (year: number) => void
	min?: moment.MomentInput
	max?: moment.MomentInput
}

const SelectYearView = ({ onSelect, selectedDate, min, max }: SelectYearViewProps) => {
	const selectedYearRef = useRef<HTMLDivElement>(null);
	const todayYearRef    = useRef<HTMLDivElement>(null);
	const selectedYear    = useMemo(() => !Array.isArray(selectedDate) ? moment(selectedDate).year() : selectedDate.length === 2 ? (moment(selectedDate[0]).year() + moment(selectedDate[1]).year()) / 2 : undefined, [selectedDate])

	useEffect(() => {
		if(selectedYearRef.current) selectedYearRef.current.scrollIntoView({ inline: "center", block: "center", behavior: "instant" });
		if(!selectedYearRef.current && todayYearRef.current) todayYearRef.current.scrollIntoView({ inline: "center", block: "center", behavior: "instant" });
	}, [selectedYearRef, todayYearRef]);

	return (
		<Col className="space-y-3 pt-4">
			{_(yearsList).chunk(4).map((yearsRows, index) => (
				<Row className="justify-between" key={index}>
					{yearsRows.map((year) => (
						<CalendarYearButton
							ref={mergeRefs([selectedYear === year ? selectedYearRef : undefined, moment().year() === year ? todayYearRef : undefined])}
							year={year}
							selectedDate={selectedDate}
							min={min}
							max={max}
							onClick={() => onSelect?.(year)}
							key={year}/>
					))}
				</Row>
			)).value()}
		</Col>
	)
}

export default SelectYearView
