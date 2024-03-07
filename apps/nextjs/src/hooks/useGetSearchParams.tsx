import { useEffect, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import type { GetSearchParams } from "~/utils/helpers";
import { getSearchParamsKeyValueObject } from "~/utils/helpers"


export const useGetSearchParams = <Params extends string[]>(...param: Params) => {
	const pathname                            = usePathname()
	const searchParams                        = useSearchParams()
	const [searchParamsState, setSearchParam] = useState<ReturnType<GetSearchParams<Params>>>(getSearchParamsKeyValueObject(searchParams, param))

	useEffect(() => {
		setSearchParam(getSearchParamsKeyValueObject(new URLSearchParams(searchParams), param))
	}, [pathname, searchParams]);

	return searchParamsState
}
