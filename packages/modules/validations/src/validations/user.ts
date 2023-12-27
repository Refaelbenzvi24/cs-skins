import * as generalValidations from "./general"
import { z } from "zod"


const { search } = generalValidations

export const list = {
	...generalValidations.infiniteQueryValidation,
	search
}

export const create = {
	email:    generalValidations.email,
	password: generalValidations.password,
	name:     z.string()
	           .min(3, { message: "forms:errors.nameTooShort" })
	           .max(64, { message: "forms:errors.nameTooLong" })
}
