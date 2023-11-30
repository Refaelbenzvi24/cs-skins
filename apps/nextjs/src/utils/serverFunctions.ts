import { headers } from "next/headers"
import { getSearchParamsKeyValueObject } from "~/utils/helpers"

export const getPathname     = () => headers().get("x-pathname")
export const getSearchParams = <Params extends string[]>(...params: Params) => {
	const searchParamsHeader = headers().get("x-search-params")
	const searchParams       = searchParamsHeader ? new URLSearchParams(searchParamsHeader) : new URLSearchParams()

	return getSearchParamsKeyValueObject(searchParams, params)
}
