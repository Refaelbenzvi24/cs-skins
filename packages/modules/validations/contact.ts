import {z} from "zod"
import validator from "validator"

const contactObject = {
	name: z.string()
	       .min(1, {message: "forms:contact.errors.nameRequired"}),
	email: z.string()
	        .min(1, {message: "forms:contact.errors.emailRequired"})
	        .email({message: "forms:contact.errors.validEmail"}),
	phone: z.string()
	        .min(1, {message: "forms:contact.errors.phoneNumberRequired"})
	        .refine(validator.isMobilePhone, {message: "forms:contact.errors.validPhoneNumber"}),
	message: z.string()
	          .optional()
}

const listLeadsObject = {
	limit: z.number()
	        .min(1)
	        .max(100)
	        .optional(),
	cursor: z.string()
	         .cuid()
	         .optional(),
	search: z.string()
	         .min(2, {message: 'admin:search.mustBeLongerThan2'})
	         .or(z.string().max(0))
	         .optional()
}


const leadsValidations = {
	contactObject,
	listLeadsObject
}

export default leadsValidations
