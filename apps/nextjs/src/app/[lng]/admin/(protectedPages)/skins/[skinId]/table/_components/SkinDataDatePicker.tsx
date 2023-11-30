"use client";
import moment from "moment"
import { DatePicker } from "@acme/ui"
import type { ComponentProps } from "react"
import { useSearchParamState } from "~/hooks"


interface SkinDataDatePickerProps extends ComponentProps<typeof DatePicker> {
	initialStartDate?: string,
	initialEndDate?: string,
}

const SkinDataDatePicker = ({ initialStartDate, initialEndDate, ...restProps }: SkinDataDatePickerProps) => {
	const { onChange: onStartDateChange } = useSearchParamState({
		key:                                "startDate",
		beforeRouteChangeParamsTransformer: (params, value) => {
			if(value){
				params.set("startDate", moment(value).format("MM-DD-YYYY"))
			} else {
				params.delete("startDate")
			}
		}
	})
	const { onChange: onEndDateChange }   = useSearchParamState({
		key:                                "endDate",
		beforeRouteChangeParamsTransformer: (params, value) => {
			if(value){
				params.set("endDate", moment(value).format("MM-DD-YYYY"))
			} else {
				params.delete("endDate")
			}
		},
	})

	return (
		<DatePicker max={moment().format("MM-DD-YYYY")}
		            min={moment().subtract(1, "year")}
		            filterOptions={["thisWeek", "thisMonth", "thisQuarter", "thisYear"]}
		            {...((initialStartDate && initialEndDate) ? { initialDate: [initialStartDate, initialEndDate] } : {})}
		            onChange={({ range }) => {
			            if(Array.isArray(range) && range.length === 2){
				            onStartDateChange(range[0])
				            onEndDateChange(range[1])
			            }
		            }}
		            {...restProps}/>
	);
}

export default SkinDataDatePicker
