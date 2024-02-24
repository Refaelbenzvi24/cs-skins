"use client";
import { useSession } from "next-auth/react"
import { useTranslation } from "~/app/i18n/client"
import i18next from "i18next"
import { useEffect, useState } from "react"
import {  useForm } from "react-hook-form"
import type {SubmitHandler} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { serverSignIn } from "~/server/actions/authServerActions"
import { Button, Col, Divider, Row, TextField, theme, Typography } from "@acme/ui"
import { authValidations } from "@acme/validations"
import { z } from "zod"
import { withTransaction } from "@elastic/apm-rum-react"
import usePRouter from "~/hooks/usePRouter"


const loginValidation = z.object(authValidations.loginObject)

type LoginValidationSchema = z.infer<typeof loginValidation>

const LoginPage = () => {
	const router                                  = usePRouter()
	const { status }                              = useSession()
	const { t, i18n }                             = useTranslation(i18next.language, 'forms')
	const [formHasSubmitted, setFormHasSubmitted] = useState(false)

	const { handleSubmit, reset, formState: { errors, isSubmitting, isDirty, isValid }, register } = useForm<LoginValidationSchema>({
		resolver: zodResolver(loginValidation),
		mode:     "onChange"
	})

	const onSubmit: SubmitHandler<LoginValidationSchema> = async (data) => {
		await serverSignIn(data)
		router.push(`/${i18n.language}/admin`)
		reset()
	}

	useEffect(() => {
		if(status === "authenticated") router.push(`/${i18n.language}/admin`)
	}, [i18n.language, router, status])

	return (
		<main className="h-full w-full">
			<Col className="h-full w-full justify-center items-center mx-auto min-[600px]:w-[580px] px-[30px]">
				<Row
					className="items-center justify-center rtl:space-x-reverse w-full px-[24px] pb-[120px]">
					<Divider className="max-[800px]:hidden"
					         thickness={"2px"}/>
					<Typography className="whitespace-nowrap mx-[18px]"
					            variant="h2"
					            color={theme.colorScheme.primary}>
						{t("common:login")}
					</Typography>
					<Divider className="max-[800px]:hidden"
					         thickness={"2px"}/>
				</Row>

				<form className="flex flex-col w-full items-center justify-center"
				      onSubmit={(event) => {
					      if(!formHasSubmitted) setFormHasSubmitted(() => true)
					      void handleSubmit(onSubmit)(event)
				      }}>
					<Col className="space-y-1 w-full pb-[60px]">
						<TextField
							{...register("email")}
							id="email"
							disabled={isSubmitting}
							label={t("forms:admin.login.labels.email")}
							error={!!errors.email}
							helperText={errors.email?.message ? t(errors.email?.message) : ""}/>

						<TextField
							{...register("password")}
							type="password"
							id="password"
							disabled={isSubmitting}
							label={t("forms:admin.login.labels.password")}
							error={!!errors.password}
							helperText={errors.password?.message ? t(errors.password?.message) : ""}/>
					</Col>

					<Button
						type="submit"
						width="200px"
						height="40px"
						disabled={formHasSubmitted ? isSubmitting || !isDirty || !isValid : false}>
						<Typography variant={"bold"} color={theme.colorScheme.light}>
							{t("common:login")}
						</Typography>
					</Button>
				</form>
			</Col>
		</main>
	)
}

export default withTransaction(LoginPage.name, 'page')(LoginPage)
