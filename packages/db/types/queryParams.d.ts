export interface PaginateParams {
	limit?: number | null | undefined
	cursor?: string | null | undefined
}

interface PaginateWithSearchParams extends PaginateParams {
	search?: string | null | undefined
}

interface DateRange {
	start?: Date | null | undefined
	end?: Date | null | undefined
}

interface PaginateWithDateRangeParams extends PaginateParams {
	dateRange?: DateRange | null | undefined
}

interface PaginateWithSearchAndDateRangeParams extends PaginateWithSearchParams,PaginateWithDateRangeParams {
}
