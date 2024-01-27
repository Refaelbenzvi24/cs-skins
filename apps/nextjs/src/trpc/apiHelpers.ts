import type { GetNextPageParamFunction } from "@tanstack/react-query"


type GetNextPageParam = GetNextPageParamFunction<string | null | undefined, { items: { id: string, [key: string]: unknown }[]; nextCursor: string | null }>
export const getNextPageParam: GetNextPageParam = (lastPage, allPages) => {
	if(allPages[allPages.length - 1]?.items.length === 0) return undefined
	return lastPage.nextCursor
}
