import * as generalValidations from "./general"
import { z } from "zod"

export const list = {
	...generalValidations.infiniteQueryValidation,
	search: z
	        .string()
	        .min(2, { message: "common:search.mustBeLongerThan2" })
	        .or(z.string().max(0))
	        .optional()
}
