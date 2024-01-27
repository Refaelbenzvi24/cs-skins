import _ from "lodash"

interface ItemsBaseType {
	id: string
	[key: string]: unknown
}
export const getPaginationReturning = <ItemsType extends ItemsBaseType[]>(items: ItemsType, limit?: number | undefined | null) => {
	if (items.length !== limit) {
		return {
			items,
			nextCursor: null
		}
	}

	return {
		items,
		nextCursor: items.length > 0 ? _.last (items)!.id : null
	};
}
