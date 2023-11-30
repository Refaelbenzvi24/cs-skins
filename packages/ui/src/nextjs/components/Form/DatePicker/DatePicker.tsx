"use client";
import { components } from "react-select"
import { useEffect, useRef, useState } from "react"
import clsx from "clsx"
import moment from "moment"
import type { DateLimitations } from "./helpers";
import { DATE_MONTH_DAY_YEAR_FORMAT, getRangeOptions } from "./helpers"
import type { RangeValue, Value, ValueOptions } from "./CalendarDatePickerWithoutState";
import CalendarDatePickerWithoutState from "./CalendarDatePickerWithoutState"
import useCalendarDatePicketState from "./useCalendarDatePicketState"
import type { SelectOption } from "../Select/Select"
import Select from "../Select/Select"
import Row from "../../Grid/Row"
import Divider from "../../Dividers/Divider"
import Button from "../../Buttons/Button"
import Typography from "../../Typograpy/Typogrphy"
import Icon from "../../Icon/Icon"
import IconCarbonChevronRight from "~icons/carbon/chevronRight"
import IconCarbonChevronLeft from "~icons/carbon/chevronLeft"
import Col from "../../Grid/Col"
import { useMain } from "../../../index"


interface CalendarDatePickerProps extends DateLimitations {
	initialDate?: [Value, Value]
	initialMenuState?: "calendar" | "select"
	value?: Omit<DatePickerSelectOption, "bottomDivider" | "extraDetails">
	onChange?: (date: DatePickerSelectOption) => void
	defaultRange?: ReturnType<typeof getRangeOptions>[number]["value"]
	filterOptions?: (ReturnType<typeof getRangeOptions>[number]["value"])[]
	options?: ReturnType<typeof getRangeOptions>
	onClear?: () => void
	onDone?: () => void
}

export interface DatePickerSelectOption extends SelectOption {
	range: [moment.MomentInput] | [moment.MomentInput, moment.MomentInput]
	extraDetails?: string
}

const DatePicker = (
	{
		initialDate,
		initialMenuState,
		defaultRange,
		value,
		onDone,
		onClear,
		onChange,
		filterOptions,
		disallowedDates,
		allowedDates,
		min,
		max,
		options
	}: CalendarDatePickerProps) => {
	const { dir }                          = useMain()
	const [localOptions, _setLocalOptions] = useState<ReturnType<typeof getRangeOptions>>(options ?? getRangeOptions().filter((option) => !filterOptions?.includes(option.value)))
	const [menuState, setMenuState]        = useState<"calendar" | "select">(initialMenuState ?? "select")
	const [selectedDate, setSelectedDate]  = useState<DatePickerSelectOption>((defaultRange ? localOptions.find((option) => option.value === defaultRange) : initialDate ?
		localOptions.find((option) => option.range[0] === initialDate[0] && option.range[1] === initialDate[1]) ?? {
			label: `${moment(initialDate[0]).format(DATE_MONTH_DAY_YEAR_FORMAT)} - ${moment(initialDate[1]).format(DATE_MONTH_DAY_YEAR_FORMAT)}`,
			value: `${moment(initialDate[0]).format(DATE_MONTH_DAY_YEAR_FORMAT)} - ${moment(initialDate[1]).format(DATE_MONTH_DAY_YEAR_FORMAT)}`,
			range: initialDate
		} : localOptions[0]) as DatePickerSelectOption)

	const calendarState = useCalendarDatePicketState({ initialDate })

	const setSelectedDateValue = (value: DatePickerSelectOption | ((value: DatePickerSelectOption) => DatePickerSelectOption)) => {
		if(typeof value === "function"){
			return setSelectedDate((lastValue) => {
				const newValue = value(lastValue)
				if(onChange) onChange(newValue)
				return newValue
			})
		}
		setSelectedDate(value)
		if(onChange) onChange(value)
	}

	useEffect(() => {
		if(value){
			const valueIsFromOptions = localOptions.find(({ range }) => value.range[0] === range[0] && value.range[1] === range[1])
			setSelectedDateValue((valueIsFromOptions ?? value) as DatePickerSelectOption)
		}
	}, [value]);


	return (
		<>
			<Select
				name="datePicker"
				value={selectedDate}
				onChange={(date) => setSelectedDateValue(date as DatePickerSelectOption)}
				isSearchable={false}
				options={[{ label: "DATE RANGE", options: localOptions }]}
				components={{
					Menu: ({ children, ...restProps }) => {
						return (
							<components.Menu {...restProps} className={`${clsx(restProps.className)}`}>
								{(menuState === "select") && (
									<>
										{children}
										<Row className="pb-2 px-[12px]">
											<Divider color="colorScheme.subtitle2" colorDark="colorScheme.body1"/>
										</Row>
										<Button className="w-full"
										        onClick={() => setMenuState("calendar")}
										        colorsForStates="accent"
										        colorsForStatesDark="overlaysDark"
										        elevation={0}>
											<Row className="justify-between">
												<Typography variant={"body"}>
													Custom date range
												</Typography>
												<Icon>
													{dir === "ltr"
														?
														<IconCarbonChevronRight/>
														:
														<IconCarbonChevronLeft/>
													}
												</Icon>
											</Row>
										</Button>
									</>
								)}
								{(menuState === "calendar") && (
									<Col className="pb-6 pt-2">
										<CalendarDatePickerWithoutState value={selectedDate.range}
										                                isRange
										                                min={min}
										                                max={max}
										                                onClear={onClear}
										                                onDone={onDone}
										                                allowedDates={allowedDates}
										                                disallowedDates={disallowedDates}
										                                hideBottomActions
										                                onChange={(date) => {
											                                if(date.length === 2){
												                                const valueIsFromOptions = localOptions.find(({ range }) => date[0] === range[0] && date[1] === range[1]) as DatePickerSelectOption
												                                setSelectedDateValue(valueIsFromOptions ?? {
													                                label: `${moment(date[0]).format(DATE_MONTH_DAY_YEAR_FORMAT)} - ${moment(date[1]).format(DATE_MONTH_DAY_YEAR_FORMAT)}`,
													                                value: `${moment(date[0]).format(DATE_MONTH_DAY_YEAR_FORMAT)} - ${moment(date[1]).format(DATE_MONTH_DAY_YEAR_FORMAT)}`,
													                                range: date
												                                })
											                                }
											                                if(date.length === 1){
												                                setSelectedDateValue((lastDate) => ({
													                                ...lastDate,
													                                range: date
												                                }))
											                                }
										                                }}
										                                {...calendarState}/>
									</Col>
								)}
							</components.Menu>
						)
					}
				}}
				onMenuOpen={() => setMenuState("select")}
				menuAnchor={dir === "ltr" ? "right" : "left"}
				menuMaxWidth={600}
				menuWidth={menuState === "calendar" ? 350 : 450}
				maxMenuHeight={800}
				hideHelperText/>
		</>
	)
}

export default DatePicker
