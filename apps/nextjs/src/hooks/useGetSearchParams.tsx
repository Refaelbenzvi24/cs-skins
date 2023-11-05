import { useEffect, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"


export const useGetSearchParams = (param: string) => {
	const pathname                           = usePathname()
	const searchParams                       = useSearchParams()
	const [searchParamState, setSearchParam] = useState<string>(searchParams.get(param) ?? "")

	useEffect(() => {
		setSearchParam(searchParams.get(param) ?? "")
	}, [pathname, searchParams, param]);

	return searchParamState
}
