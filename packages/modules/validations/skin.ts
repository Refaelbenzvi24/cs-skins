import { z } from "zod"
import * as generalValidations from "./general"


export const createServer = {
	url: z.array (generalValidations.urlValidation).or (generalValidations.urlValidation)
}

export const list = {
	...generalValidations.infiniteQueryValidation,
	search: z
	        .string()
	        .min(2, { message: "common:search.mustBeLongerThan2" })
	        .or(z.string().max(0))
	        .optional()
}

export const getByIdWithData = {
	...generalValidations.infiniteQueryValidation,
	skinId: z.string().cuid2(),
	search: z
	        .string()
	        .min(2, { message: "common:search.mustBeLongerThan2" })
	        .or(z.string().max(0))
	        .optional()
}

export const createClient = {
	url: z
		     .array (z.object ({ value: generalValidations.urlValidation, label: generalValidations.urlValidation }))
		     .min (1, { message: "forms.errors.urlRequired" })
}
