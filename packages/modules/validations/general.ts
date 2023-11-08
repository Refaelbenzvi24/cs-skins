import { z } from "zod"


export const infiniteQueryValidation = {
	limit:  z.number().min(1).max(100).nullish(),
	cursor: z.string().nullish(),
}

export const urlValidation = z
.string()
.min(1, { message: "forms:errors.urlRequired" })
.url({ message: "forms:errors.urlInvalid" })
.max(2083, { message: "forms:errors.urlTooLong" })
