import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useGetSearchParams } from "~/hooks/useGetSearchParams"
import { useCallback, useEffect } from "react"
import i18next from "i18next"
import { debounce } from "~/utils/helpers"


interface UseSearchParamState<ValueGetterArgs extends unknown[]> {
	key: string
	route?: string
	valueGetter?: (...args: ValueGetterArgs) => string
	beforeRouteChangeParamsTransformer?: (params: URLSearchParams, value: string) => void
	useDebounce?: boolean
	debounceTimeout?: number
}

const searchParamsStateHelper = {
	currentSearchParams: null
} as { currentSearchParams: URLSearchParams | null }

export const useSearchParamState = <ValueGetterArgs extends unknown[]>(
	{
		key,
		route,
		valueGetter,
		beforeRouteChangeParamsTransformer = (params, value) => params.set (key, value),
		useDebounce = true,
		debounceTimeout = 500
	}: UseSearchParamState<ValueGetterArgs>) => {
	const pathname = usePathname()
	const router = useRouter()
	const searchParams = useSearchParams ()
	const { [key]: value } = useGetSearchParams (key)

	useEffect(() => {
		searchParamsStateHelper.currentSearchParams = new URLSearchParams(searchParams)
	}, [searchParams])
	const handleSearch = (...args: ValueGetterArgs) => {
		const value = valueGetter ? valueGetter (...args) : args[0] as string
		if (searchParamsStateHelper.currentSearchParams === null) searchParamsStateHelper.currentSearchParams = new URLSearchParams (searchParams)
		if (beforeRouteChangeParamsTransformer) beforeRouteChangeParamsTransformer (searchParamsStateHelper?.currentSearchParams , value)

		return router.push (`${route ? `/${i18next.language}${route}` : pathname}?${(searchParamsStateHelper.currentSearchParams ?? '').toString ()}`)
	}
	const onChange = useCallback (useDebounce ? debounce (handleSearch, debounceTimeout) : handleSearch, [pathname, searchParams])

	return { value, onChange }
}
