import { z } from "zod"

const skinObject = {
	url: z.array (
		z
			.string ()
			.min (1, { message: "forms:skinData.errors.urlRequired" })
			.url ({ message: "forms:skinData.errors.urlInvalid" })
			.max (2000, { message: "forms:skinData.errors.urlTooLong" })
	).or (
		z
			.string ()
			.min (1, { message: "forms:skinData.errors.urlRequired" })
			.url ({ message: "forms:skinData.errors.urlInvalid" })
			.max (2000, { message: "forms:skinData.errors.urlTooLong" })
	)
}

const listSkinObject = {
	limit:  z.number ().min (1).max (100).optional (),
	offset: z.number ().min (0).optional (),
	search: z
		        .string ()
		        .min (2, { message: "admin:search.mustBeLongerThan2" })
		        .or (z.string ().max (0))
		        .optional ()
}

const createSkin = {
	url: z
		     .array (z.object ({
			     value: z
				            .string ()
				            .min (1, { message: "forms:skinData.errors.urlRequired" })
				            .url ({ message: "forms:skinData.errors.urlInvalid" })
				            .max (2000, { message: "forms:skinData.errors.urlTooLong" }),
			     label: z
				            .string ()
				            .min (1, { message: "forms:skinData.errors.urlRequired" })
				            .url ({ message: "forms:skinData.errors.urlInvalid" })
				            .max (2000, { message: "forms:skinData.errors.urlTooLong" })
		     }))
		     .min (1, { message: "forms:skinData.errors.urlRequired" })
}

const skinValidations = {
	createSkin,
	skinObject,
	listSkinObject
}

export default skinValidations
