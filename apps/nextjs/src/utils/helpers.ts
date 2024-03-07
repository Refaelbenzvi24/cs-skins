export function debounce<Params extends any[]>(
	func: (...args: Params) => any,
	timeout: number,
): (...args: Params) => void{
	let timer: NodeJS.Timeout

	return (...args: Params) => {
		clearTimeout(timer)
		timer = setTimeout(() => {
			func(...args)
		}, timeout)
	}
}

export type GetSearchParams<Params extends string[]> = (searchParams: URLSearchParams, params: Params) => Record<Params[number], string>

export const getSearchParamsKeyValueObject = <Params extends string[]>(searchParams: URLSearchParams, params: Params) => {
	return params.reduce((acc, param) => {
		return {
			...acc,
			[param]: searchParams.get(param) ?? ""
		}
	}, {}) as Record<Params[number], string>
}
