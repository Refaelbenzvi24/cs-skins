export interface WithLimitParam {
	limit?: number | null | undefined
}

export interface WithDateRangeParam {
	dateRange?: DateRange | null | undefined
}

export interface WithCursorParam {
	cursor?: string | null | undefined
}

export interface WithSearchParam {
	search?: string | null | undefined
}

export interface DateRange {
	start?: Date | null | undefined
	end?: Date | null | undefined
}

export type WithIdParam<IDKey extends string | number | symbol> = Record<IDKey, string>;

export interface PaginateParams extends WithLimitParam, WithCursorParam {
}

interface PaginateWithSearchParams extends PaginateParams, WithSearchParam {
}

interface PaginateWithDateRangeParams extends PaginateParams, WithDateRangeParam {
}

interface PaginateWithSearchAndDateRangeParams extends PaginateWithSearchParams, PaginateWithDateRangeParams {
}
