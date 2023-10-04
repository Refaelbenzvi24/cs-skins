import { type ReactElement, useState } from "react"
import type { GetServerSideProps } from "next"
import Head from "next/head"
import { zodResolver } from "@hookform/resolvers/zod"
import useTranslation from "next-translate/useTranslation"
import { useForm, type SubmitHandler, Controller } from "react-hook-form"
import { z } from "zod"
import { getServerSession } from "@acme/auth"
import { Button, Col, Divider, Row, Typography, theme, Select } from "@acme/ui"
import { skinValidations } from "@acme/validations"

import { api } from "~/utils/api"
import { getProxySSGHelpers } from "~/utils/ssg"
import AdminLayout from "~/layouts/AdminLayout"

const createSkinValidation = z.object (skinValidations.createSkin)

type createSkinValidationSchema = z.infer<typeof createSkinValidation>

export const getServerSideProps: GetServerSideProps = async context => {
	const session = await getServerSession (context)

	if (!session || !session.user) {
		return {
			redirect: {
				permanent:   false,
				destination: "/admin/login"
			}
		}
	}

	const ssg = await getProxySSGHelpers (context)

	await ssg.auth.getSession.prefetch ()

	return {
		props: {
			trpcState: ssg.dehydrate ()
		}
	}
}

const Page = () => {
	const createSkinMutation = api.skin.create.useMutation()
	const { t } = useTranslation ()

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
			url: data.url.map(({ value }) => value)
		}
		createSkinMutation.mutate (transformedData)
		reset ()
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
						className="w-full items-center justify-center space-x-[18px] px-[24px] pb-[120px] rtl:space-x-reverse">
						<Divider className="max-[800px]:hidden" thickness="2px"/>
						<Typography
							className="whitespace-nowrap"
							variant="h2"
							color={theme.colorScheme.primary}>
							Add Skin
						</Typography>
						<Divider className="max-[800px]:hidden" thickness="2px"/>
					</Row>

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
										creatable={true}
										textInput={true}
										onBlur={onBlur}
										value={value}
										name={name}
										ref={ref}
										id="url"
										label="Url"
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
								Add
							</Typography>
						</Button>
					</form>
				</Col>
			</main>
		</>
	)
}

Page.getLayout = (page: ReactElement) => <AdminLayout>{page}</AdminLayout>

export default Page
