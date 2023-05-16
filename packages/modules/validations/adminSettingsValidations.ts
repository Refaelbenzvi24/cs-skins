import {z} from "zod"

const emailDestination = {
	email: z.string()
	        .min(1, {message: "forms:admin.settings.emailDestination.errors.emailRequired"})
	        .email({message: "forms:admin.settings.emailDestination.errors.validEmail"}),
	password: z.string()
	           .min(1, {message: "forms:admin.settings.emailDestination.errors.passwordRequired"})
}


const adminSettingsValidations = {
	emailDestination
}

export default adminSettingsValidations
