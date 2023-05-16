import type {GetServerSideProps} from "next"
import {signIn, useSession} from "next-auth/react"
import {Button, Col, Divider, Row, TextField, theme, Typography} from "@acme/ui"
import {type SubmitHandler, useForm} from "react-hook-form"
import useTranslation from "next-translate/useTranslation"
import {ReactElement, useEffect, useState} from "react"
import {authValidations} from "@acme/validations"
import {zodResolver} from "@hookform/resolvers/zod"

import {z} from "zod"
import {useRouter} from "next/router"
import AdminLayout from "~/layouts/AdminLayout"
import {getProxySSGHelpers} from "~/utils/ssg";


const loginValidation = z.object(authValidations.loginObject)

type LoginValidationSchema = z.infer<typeof loginValidation>

export const getServerSideProps: GetServerSideProps = async (context) => {
	const ssg = await getProxySSGHelpers(context)
	
	await ssg.auth.getSession.prefetch()
	
	return {
		props: {
			trpcState: ssg.dehydrate()
		}
	}
}

const Page = () => {
	const router = useRouter()
	
	const {t} = useTranslation()
	const {status} = useSession()
	
	const [formHasSubmitted, setFormHasSubmitted] = useState(false)
	
	const {
		handleSubmit,
		reset,
		formState: {errors, isSubmitting, isDirty, isValid},
		register
	} = useForm<LoginValidationSchema>({
		resolver: zodResolver(loginValidation),
		mode: "onChange"
	})
	
	const onSubmit: SubmitHandler<LoginValidationSchema> = async (data) => {
		await signIn('credentials', {
			redirect: false,
			username: data.email,
			...data
		})
		reset()
	}
	
	
	useEffect(() => {
		if (status === 'authenticated') void router.push('/admin')
	}, [status])
	
	return (
		<Col className="h-full justify-center items-center mx-auto min-[600px]:w-[580px] px-[30px]">
			<Row className="items-center justify-center space-x-[18px] rtl:space-x-reverse w-full px-[24px] pb-[120px]">
				<Divider className="max-[800px]:hidden"
				         thickness={'2px'}/>
				<Typography className="whitespace-nowrap"
				            variant="h2"
				            color={theme.colorScheme.primary}>
					{t('common:login')}
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
						{...register('email')}
						id="email"
						disabled={isSubmitting}
						label={t('forms:admin.login.labels.email')}
						error={!!errors.email}
						helperText={errors.email?.message ? t(errors.email?.message) : ""}/>
					
					<TextField
						{...register('password')}
						type="password"
						id="password"
						disabled={isSubmitting}
						label={t('forms:admin.login.labels.password')}
						error={!!errors.password}
						helperText={errors.password?.message ? t(errors.password?.message) : ""}/>
				</Col>
				
				<Button
					type="submit"
					width="200px"
					height="40px"
					disabled={formHasSubmitted ? isSubmitting || !isDirty || !isValid : false}>
					<Typography variant={'bold'} color={theme.colorScheme.light}>
						{t('common:login')}
					</Typography>
				</Button>
			</form>
		</Col>
	)
}

Page.getLayout = (page: ReactElement) => (
	<AdminLayout adminAppBarProps={{
		removeLogoutButton: true,
		removeSettingsButton: true
	}}>
		{page}
	</AdminLayout>
)

export default Page
