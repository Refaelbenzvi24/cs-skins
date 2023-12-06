interface PaginatedResponse {
	items: { [key: string | number | symbol]: unknown, id: string | number }[]
	nextCursor?: string | number | null | undefined
}

export const getNextPageParam = (lastPage: PaginatedResponse, allPages: PaginatedResponse[]) => {
	if (allPages[allPages.length - 1]?.items.length === 0) return undefined
	return lastPage.nextCursor
}
