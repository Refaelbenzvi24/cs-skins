import _ from "lodash"


const transformKeysStringIntoNestedObject = (keys: string[]) => {
	return keys.reduce((acc, key) => {
		const keyParts = key.split('.')
		const lastKey  = keyParts.pop()
		if(lastKey){
			return keyParts.reduce((acc, keyPart) => {
				if(keyPart in acc){
					return {
						...acc,
						[keyPart]: {
							...acc[keyPart as keyof typeof acc] as object,
							[lastKey]: ''
						}
					}
				}
				return {
					...acc,
					[keyPart]: { [lastKey]: '' }
				}
			}, acc)
		}
		return acc
	}, {})
}

const orderByNamespace = (results: string[]) => {
	return results.reduce((acc, match) => {
		if(!match) return acc
		const [namespace, key] = match.split(':')
		if(key && namespace && !(namespace in acc)){
			return {
				...acc,
				[namespace]: [key]
			}
		}
		if(key && namespace && namespace in acc){
			return {
				...acc,
				[namespace]: [...acc[namespace as keyof typeof acc], key]
			}
		}
		return acc
	}, {}) as Record<string, string[]>
}

export const transform = (results: string[]) => {
	const byNamespace = orderByNamespace(results)
	return _.mapValues(byNamespace, (value) => transformKeysStringIntoNestedObject(value))
}
