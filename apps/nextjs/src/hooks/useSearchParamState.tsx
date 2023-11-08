import { useRouter, useSearchParams } from "next/navigation"
import { useGetSearchParams } from "~/hooks/useGetSearchParams"
import { useCallback } from "react"
import i18next from "i18next"
import { debounce } from "~/utils/helpers"


interface UseSearchParamState<ValueGetterArgs extends unknown[]> {
	key: string
	route: string
	valueGetter: (...args: ValueGetterArgs) => string
	beforeRouteChangeParamsTransformer?: (params: URLSearchParams, value: string) => void
	useDebounce?: boolean
	debounceTimeout?: number
}

export const useSearchParamState = <ValueGetterArgs extends unknown[]>(
	{
		key,
		route,
		valueGetter,
		beforeRouteChangeParamsTransformer,
		useDebounce = true,
		debounceTimeout = 500
	}: UseSearchParamState<ValueGetterArgs>) => {
	const router = useRouter ()
	const searchParams = useSearchParams ()
	const search = useGetSearchParams (key)

	const handleSearch = (...args: ValueGetterArgs) => {
		const value = valueGetter (...args)
		const params = new URLSearchParams (searchParams)
		if (beforeRouteChangeParamsTransformer) beforeRouteChangeParamsTransformer(params, value)

		return router.push (`/${i18next.language}${route}?${params.toString ()}`)
	}

	const searchHandler = useCallback (useDebounce ? debounce (handleSearch, debounceTimeout) : handleSearch, [])

	return { search, searchHandler }
}
