import * as generalValidations from "./general"

const { search } = generalValidations

export const list = {
	...generalValidations.infiniteQueryValidation,
	search
}
