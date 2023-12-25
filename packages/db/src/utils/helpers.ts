import type { SQL } from "drizzle-orm"


export const addAsToSelectKeys = <SelectObject extends Record<string, SQL<unknown>>>(selectObject: SelectObject) => {
	return Object.entries(selectObject).reduce((acc, [key, value]) => {
		return {
			...acc,
			[key]: (value).as(key)
		}
	}, {}) as { [K in keyof SelectObject]: SQL.Aliased<SelectObject[K]['_']['type']> }
}
