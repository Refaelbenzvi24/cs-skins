import {z} from "zod"

export const emailDestination = {
	email: z.string()
	        .min(1, {message: "forms:admin.settings.emailDestination.errors.emailRequired"})
	        .email({message: "forms:admin.settings.emailDestination.errors.validEmail"}),
	password: z.string()
	           .min(1, {message: "forms:admin.settings.emailDestination.errors.passwordRequired"})
}


export const adminSettingsValidations = {
	emailDestination
}
