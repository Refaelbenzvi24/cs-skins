"use client";
import { Button, Col, Select, theme, Typography } from "@acme/ui"
import type { SubmitHandler} from "react-hook-form";
import { Controller, useForm } from "react-hook-form"
import { api } from "~/utils/api"
import { useTranslation } from "~/app/i18n/client"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { skinValidations } from "@acme/validations"
import type { ComponentWithLocaleProps } from "~/types"

const createSkinValidation = z.object (skinValidations.createSkin)

type createSkinValidationSchema = z.infer<typeof createSkinValidation>

const AddSkinForm = ({lng}: ComponentWithLocaleProps) => {
	const createSkinMutation = api.skin.create.useMutation ()
	const { t } = useTranslation (lng, ["admin"])

	const [formHasSubmitted, setFormHasSubmitted] = useState (false)

	const {
		handleSubmit,
		reset,
		control,
		formState: { errors, isSubmitting, isDirty, isValid }
	} = useForm<createSkinValidationSchema> ({
		resolver: zodResolver (createSkinValidation),
		mode:     "onChange"
	})

	const onSubmit: SubmitHandler<createSkinValidationSchema> = data => {
		const transformedData = {
			url: data.url.map (({ value }) => value)
		}
		createSkinMutation.mutate (transformedData)
		reset ()
	}

	return (
		<form
			className="flex w-full flex-col items-center justify-center"
			onSubmit={event => {
				if (!formHasSubmitted) setFormHasSubmitted (() => true)
				void handleSubmit (onSubmit) (event)
			}}>
			<Col className="w-full space-y-1 pb-[60px]">
				<Controller
					defaultValue={[]}
					name={"url"}
					control={control}
					render={({ field: { ref, onChange, onBlur, name, value } }) => (
						<Select
							onChange={onChange}
							isMulti={true}
							textInput={true}
							creatable={true}
							options={[
								{ value: "one", label: "One" },
								{ value: "two", label: "Two" }
							]}
							onBlur={onBlur}
							value={value}
							name={name}
							ref={ref}
							id="url"
							label={t ("admin:url")}
							error={!!errors.url}
							helperText={errors.url?.message ? t (errors.url?.message) : ""}
						/>
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
					{t ("admin:add")}
				</Typography>
			</Button>
		</form>
	)
}

export default AddSkinForm
