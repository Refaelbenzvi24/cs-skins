import { z } from "zod"
import * as generalValidations from "./general"


const { search } = generalValidations

export const createServer = {
	url: z.array(generalValidations.urlValidation).or(generalValidations.urlValidation)
}

export const list = {
	...generalValidations.infiniteQueryValidation,
	search
}

export const getByIdWithData = {
	...generalValidations.infiniteQueryValidation,
	...generalValidations.dateRangeValidation,
	skinId: z.string().cuid2(),
	search
}

export const createClient = {
	url: z
	     .array(z.object({ value: generalValidations.urlValidation, label: generalValidations.urlValidation }))
	     .min(1, { message: "forms.errors.urlRequired" })
}
