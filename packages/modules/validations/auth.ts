import {z} from "zod"

export const loginObject = {
	email: z.string()
	        .min(1, {message: "forms:admin.login.errors.emailRequired"})
	        .email({message: "forms:admin.login.errors.validEmail"}),
	password: z.string()
	           .min(1, {message: "forms:admin.login.errors.passwordRequired"})
}

export const authValidations = {
	loginObject
}
