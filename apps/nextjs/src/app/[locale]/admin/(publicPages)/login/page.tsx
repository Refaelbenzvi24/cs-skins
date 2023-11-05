"use client";
import { signIn, useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import type { SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import Head from "next/head"
import { Button, Col, Divider, Row, TextField, theme, Typography } from "@acme/ui"
import { z } from "zod"
import { authValidations } from "@acme/validations"
import { useParams, useRouter } from "next/navigation"
import { useClientTranslation } from "~/app/i18n/client"
import i18next from "i18next"

const loginValidation = z.object (authValidations.loginObject)

type LoginValidationSchema = z.infer<typeof loginValidation>

const Page = () => {
	const router = useRouter()
	const { status } = useSession ()
	const { t, i18n } = useClientTranslation(i18next.language, 'forms')
	const [formHasSubmitted, setFormHasSubmitted] = useState (false)

	const {
		handleSubmit,
		reset,
		formState: { errors, isSubmitting, isDirty, isValid },
		register
	} = useForm<LoginValidationSchema> ({
		resolver: zodResolver (loginValidation),
		mode:     "onChange"
	})

	const onSubmit: SubmitHandler<LoginValidationSchema> = async (data) => {
		const result = await signIn ("credentials", {
			redirect: false,
			username: data.email,
			...data
		})
		reset ()
	}

	useEffect (() => {
		if (status === "authenticated") router.push (`/${i18n.language}/admin`)
	}, [router, status])

	return (
		<>
			<Head>
				<title>CS Skins | Login</title>
				<meta name="description" content={"CS Skins"}/>
			</Head>

			<main className="h-full">
				<Col className="h-full justify-center items-center mx-auto min-[600px]:w-[580px] px-[30px]">
					<Row
						className="items-center justify-center rtl:space-x-reverse w-full px-[24px] pb-[120px]">
						<Divider className="max-[800px]:hidden"
						         thickness={"2px"}/>
						<Typography className="whitespace-nowrap mx-[18px]"
						            variant="h2"
						            color={theme.colorScheme.primary}>
							{t ("common:login")}
						</Typography>
						<Divider className="max-[800px]:hidden"
						         thickness={"2px"}/>
					</Row>

					<form className="flex flex-col w-full items-center justify-center"
					      onSubmit={(event) => {
						      if (!formHasSubmitted) setFormHasSubmitted (() => true)
						      void handleSubmit (onSubmit) (event)
					      }}>
						<Col className="space-y-1 w-full pb-[60px]">
							<TextField
								{...register ("email")}
								id="email"
								disabled={isSubmitting}
								label={t ("forms:admin.login.labels.email")}
								error={!!errors.email}
								helperText={errors.email?.message ? t (errors.email?.message) : ""}/>

							<TextField
								{...register ("password")}
								type="password"
								id="password"
								disabled={isSubmitting}
								label={t ("forms:admin.login.labels.password")}
								error={!!errors.password}
								helperText={errors.password?.message ? t (errors.password?.message) : ""}/>
						</Col>

						<Button
							type="submit"
							width="200px"
							height="40px"
							disabled={formHasSubmitted ? isSubmitting || !isDirty || !isValid : false}>
							<Typography variant={"bold"} color={theme.colorScheme.light}>
								{t ("common:login")}
							</Typography>
						</Button>
					</form>
				</Col>
			</main>
		</>
	)
}

export default Page
