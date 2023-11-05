"use client";
import { api } from "~/utils/api"
import { useState } from "react"
import type { SubmitHandler } from "react-hook-form";
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Head from "next/head"
import { Button, Col, Divider, Row, Select, theme, Typography } from "@acme/ui"
import { z } from "zod"
import { skinValidations } from "@acme/validations"
import { useClientTranslation } from "~/app/i18n/client"


const createSkinValidation = z.object(skinValidations.createSkin)

type createSkinValidationSchema = z.infer<typeof createSkinValidation>

const Page = () => {
	const createSkinMutation = api.skin.create.useMutation()
	const { t }              = useClientTranslation()

	const [formHasSubmitted, setFormHasSubmitted] = useState(false)

	const {
		      handleSubmit,
		      reset,
		      control,
		      formState: { errors, isSubmitting, isDirty, isValid }
	      } = useForm<createSkinValidationSchema>({
		resolver: zodResolver(createSkinValidation),
		mode:     "onChange"
	})

	const onSubmit: SubmitHandler<createSkinValidationSchema> = data => {
		const transformedData = {
			url: data.url.map(({ value }) => value)
		}
		createSkinMutation.mutate(transformedData)
		reset()
	}

	return (
		<>
			<Head>
				<title>CS Skin | Add Skin</title>
				<meta name="description" content=""/>
			</Head>

			<main className="h-full">
				<Col className="mx-auto h-full items-center justify-center min-[950px]:w-[900px] px-[30px]">
					<Row
						className="w-full items-center justify-center px-[24px] pb-[120px] rtl:space-x-reverse">
						<Divider className="max-[800px]:hidden" thickness="2px"/>
						<Typography
							className="whitespace-nowrap mx-[18px]"
							variant="h2"
							color={'colorScheme.primary'}>
							Add Skin
						</Typography>
						<Divider className="max-[800px]:hidden" thickness="2px"/>
					</Row>

					<form
						className="flex w-full flex-col items-center justify-center"
						onSubmit={event => {
							if(!formHasSubmitted) setFormHasSubmitted(() => true)
							void handleSubmit(onSubmit)(event)
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
										label="Url"
										error={!!errors.url}
										helperText={errors.url?.message ? t(errors.url?.message) : ""}
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
								{t('admin:add')}
							</Typography>
						</Button>
					</form>
				</Col>
			</main>
		</>
	)
}

export default Page
