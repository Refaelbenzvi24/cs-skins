import { z } from "zod"

export const withLimit = {
	limit:  z.number().min(1).max(100).nullish(),
}

export const withCursor = {
	cursor: z.string().nullish(),
}

export const infiniteQueryValidation = {
	...withLimit,
	...withCursor
}

export const search = z
.string()
.min(2, { message: "common:search.mustBeLongerThan2" })
.or(z.string().max(0))
.optional()

export const dateRangeValidation = {
	dateRange: z.object({
		start: z.date().max(new Date()).optional(),
		end:   z.date().max(new Date()).optional()
	}).optional()
}


export const urlValidation = z
.string()
.min(1, { message: "forms:errors.urlRequired" })
.url({ message: "forms:errors.urlInvalid" })
.max(2083, { message: "forms:errors.urlTooLong" })
