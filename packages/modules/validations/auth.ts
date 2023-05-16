import {z} from "zod"

const loginObject = {
	email: z.string()
	        .min(1, {message: "forms:admin.login.errors.emailRequired"})
	        .email({message: "forms:admin.login.errors.validEmail"}),
	password: z.string()
	           .min(1, {message: "forms:admin.login.errors.passwordRequired"})
}

const authValidations = {
	loginObject
}

export default authValidations
