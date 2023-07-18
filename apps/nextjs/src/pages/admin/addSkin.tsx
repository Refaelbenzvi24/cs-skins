import type {GetServerSideProps} from "next"
import Head from "next/head"
import {useSession} from "next-auth/react"
import {Button, Col, Divider, Row, TextField, theme, Typography} from "@acme/ui"
import {type SubmitHandler, useForm} from "react-hook-form"
import useTranslation from "next-translate/useTranslation"
import {ReactElement, useState} from "react"
import {skinValidations} from "@acme/validations"
import {zodResolver} from "@hookform/resolvers/zod"

import {z} from "zod"
import {useRouter} from "next/router"
import AdminLayout from "~/layouts/AdminLayout"
import {getProxySSGHelpers} from "~/utils/ssg";
import {getServerSession} from "@acme/auth";
import {api} from "~/utils/api";


const createSkinValidation = z.object(skinValidations.createSkin)

type createSkinValidationSchema = z.infer<typeof createSkinValidation>

export const getServerSideProps: GetServerSideProps = async (context) => {
	const session = await getServerSession(context)
	
	if (!session || !session.user) {
		return {
			redirect: {
				permanent: false,
				destination: '/admin/login'
			}
		}
	}
	
	const ssg = await getProxySSGHelpers(context)
	
	await ssg.auth.getSession.prefetch()
	
	return {
		props: {
			trpcState: ssg.dehydrate()
		}
	}
}

const Page = () => {
	const submitFormMutation = api.skin.create.useMutation()
	const router = useRouter()
	
	const {t} = useTranslation()
	const {status} = useSession()
	
	const [formHasSubmitted, setFormHasSubmitted] = useState(false)
	
	const {
		handleSubmit,
		reset,
		formState: {errors, isSubmitting, isDirty, isValid},
		register
	} = useForm<createSkinValidationSchema>({
		resolver: zodResolver(createSkinValidation),
		mode: "onChange"
	})
	
	const onSubmit: SubmitHandler<createSkinValidationSchema> = async (data) => {
		submitFormMutation.mutate(data)
		reset()
	}
	
	return (
		<>
			<Head>
				<title>CS Skin | Add Skin</title>
				<meta name="description" content=""/>
			</Head>
			
			<main className="h-full">
				<Col className="h-full justify-center items-center mx-auto min-[600px]:w-[580px] px-[30px]">
					<Row className="items-center justify-center space-x-[18px] rtl:space-x-reverse w-full px-[24px] pb-[120px]">
						<Divider className="max-[800px]:hidden"
						         thickness={'2px'}/>
						<Typography className="whitespace-nowrap"
						            variant="h2"
						            color={theme.colorScheme.primary}>
							Add Skin
						</Typography>
						<Divider className="max-[800px]:hidden"
						         thickness={'2px'}/>
					</Row>
					
					<form className="flex flex-col w-full items-center justify-center"
					      onSubmit={(event) => {
						      if (!formHasSubmitted) setFormHasSubmitted(() => true)
						      void handleSubmit(onSubmit)(event)
					      }}>
						<Col className="space-y-1 w-full pb-[60px]">
							<TextField
								{...register('url')}
								id="url"
								disabled={isSubmitting}
								label={'Url'}
								error={!!errors.url}
								helperText={errors.url?.message ? t(errors.url?.message) : ""}/>
						</Col>
						
						<Button
							type="submit"
							width="200px"
							height="40px"
							disabled={formHasSubmitted ? isSubmitting || !isDirty || !isValid : false}>
							<Typography variant={'bold'} color={theme.colorScheme.light}>
								Add
							</Typography>
						</Button>
					</form>
				</Col>
			</main>
		</>
	)
}

Page.getLayout = (page: ReactElement) => (
	<AdminLayout>
		{page}
	</AdminLayout>
)

export default Page
