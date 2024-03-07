"use client";
import { Button, Col, TextField, theme, Typography } from "@acme/ui"
import { Controller, SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form"
import { api } from "~/trpc/api"
import { useTranslation } from "~/app/i18n/client"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { userValidations } from "@acme/validations"
import type { ComponentWithLocaleProps } from "~/types"
import { useToasts } from "~/hooks"


const createUserValidation = z.object(userValidations.create)

type createUserValidationSchema = z.infer<typeof createUserValidation>

const CreateUserForm = ({ lng }: ComponentWithLocaleProps) => {
	const createUserMutation               = api.user.create.useMutation()
	const { t }                            = useTranslation(lng, ["admin", "forms"])
	const { generalSuccess, generalError } = useToasts()

	const [formHasSubmitted, setFormHasSubmitted] = useState(false)

	const {
		      handleSubmit,
		      reset,
		      control,
		      formState: { errors, isSubmitting, isDirty, isValid }
	      } = useForm<createUserValidationSchema>({
		resolver: zodResolver(createUserValidation),
		mode:     "onChange"
	})

	const onSubmit: SubmitHandler<createUserValidationSchema> = async (data) => {
		try {
			await createUserMutation.mutateAsync(data)
			reset()
			generalSuccess("admin:skins.create.success")
		} catch {
			generalError("admin:skins.create.error")
		}
	}

	return (
		<form
			className="flex w-full flex-col items-center justify-center"
			onSubmit={event => {
				if(!formHasSubmitted) setFormHasSubmitted(() => true)
				void handleSubmit(onSubmit)(event)
			}}>
			<Col className="space-y-1 w-full pb-[60px]">
				<Controller
					defaultValue={""}
					name={"name"}
					control={control}
					render={({ field: { ref, onChange, onBlur, name, value } }) => (
						<TextField
							id="name"
							ref={ref}
							onChange={onChange}
							onBlur={onBlur}
							name={name}
							value={value}
							disabled={isSubmitting}
							label={t("forms:admin.users.create.labels.name")}
							error={!!errors.name}
							helperText={errors.name?.message ? t(errors.name?.message) : ""}/>
					)}/>

				<Controller
					defaultValue={""}
					name={"email"}
					control={control}
					render={({ field: { ref, onChange, onBlur, name, value } }) => (
						<TextField
							id="email"
							ref={ref}
							onChange={onChange}
							onBlur={onBlur}
							name={name}
							value={value}
							disabled={isSubmitting}
							label={t("forms:admin.users.create.labels.email")}
							error={!!errors.email}
							helperText={errors.email?.message ? t(errors.email?.message) : ""}/>
					)}/>

				<Controller
					defaultValue={""}
					name={"password"}
					control={control}
					render={({ field: { ref, onChange, onBlur, name, value } }) => (
						<TextField
							ref={ref}
							onChange={onChange}
							onBlur={onBlur}
							name={name}
							value={value}
							type="password"
							id="password"
							disabled={isSubmitting}
							label={t("forms:admin.users.create.labels.password")}
							error={!!errors.password}
							helperText={errors.password?.message ? t(errors.password?.message) : ""}/>
					)}/>
			</Col>

			<Button
				type="submit"
				width="200px"
				height="40px"
				disabled={
					formHasSubmitted
						? isSubmitting || !isDirty || !isValid
						: false
				}>
				<Typography variant="bold" color={theme.colorScheme.light}>
					{t("admin:add")}
				</Typography>
			</Button>
		</form>
	)
}

export default CreateUserForm
