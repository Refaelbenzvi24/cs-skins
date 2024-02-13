"use server";
import { signIn, signOut } from "@acme/auth"
import { z } from "zod"
import { authValidations } from "@acme/validations/src/validations/auth"

const loginValidation = z.object(authValidations.loginObject)

type LoginValidationSchema = z.infer<typeof loginValidation>

export const serverSignIn = async (data: LoginValidationSchema) => {
	return await signIn("credentials", {
		redirect: false,
		username: data.email,
		...data
	})
}

export const serverSignOut = async () => {
	return await signOut ({ redirect: false })
}
