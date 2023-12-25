import * as generalValidations from "./general"
import { z } from "zod"

const { search } = generalValidations

export const list = {
	...generalValidations.infiniteQueryValidation,
	search
}
