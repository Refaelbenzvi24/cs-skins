import useToasts from "~/hooks/useToasts"
import {Button, Col, Row, TextArea, TextField, theme, Typography, useDimensions} from "@acme/ui"
import {type SubmitHandler, Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod"
import {z} from "zod"
import {adminSettingsValidations} from "@acme/validations"
import {useState} from "react";
import useTranslation from "next-translate/useTranslation"
import {api} from "~/utils/api";


const emailDestinationValidation = z.object(adminSettingsValidations.emailDestination)

type EmailDestinationValidationSchema = z.infer<typeof emailDestinationValidation>


const EmailDestinationForm = () => {
	// const submitFormMutation = api.leads.create.useMutation()
	// const toasts = useToasts()
	const {windowWidth} = useDimensions()
	const {t} = useTranslation()
	
	const [formHasSubmitted, setFormHasSubmitted] = useState(false)
	
	const {
		handleSubmit,
		reset,
		control,
		formState: {errors, isSubmitting, isDirty, isValid}
	} = useForm<EmailDestinationValidationSchema>({
		resolver: zodResolver(emailDestinationValidation),
		mode: "onChange",
	})
	
	const onSubmit: SubmitHandler<EmailDestinationValidationSchema> = async (data) => {
		// await toasts.sendEmail(submitFormMutation.mutateAsync(data))
		reset({
			email: "",
			password: ""
		})
	}
	
	
	return (
		<form onSubmit={(event) => {
			if (!formHasSubmitted) setFormHasSubmitted(() => true)
			void handleSubmit(onSubmit)(event)
		}}>
			<Col className="space-y-1">
				<Controller
					defaultValue={""}
					name={"email"}
					control={control}
					render={({field}) => (
						<TextField
							{...field}
							autoFocus
							required
							disabled={isSubmitting}
							labelProps={{hasBackground: !!windowWidth && windowWidth < 1300}}
							helperTextProps={{hasBackground: !!windowWidth && windowWidth < 1300}}
							label={t('forms:admin.settings.emailDestination.labels.email')}
							persistentLabel
							bgColorDark={theme.colorScheme.overlaysDark2}
							error={!!errors.email}
							helperText={errors.email?.message ? t(errors.email?.message) : ""}/>
					)}/>
				
				<Controller
					defaultValue={""}
					name={"password"}
					control={control}
					render={({field}) => (
						<TextField
							{...field}
							required
							disabled={isSubmitting}
							labelProps={{hasBackground: !!windowWidth && windowWidth < 1300}}
							helperTextProps={{hasBackground: !!windowWidth && windowWidth < 1300}}
							label={t('forms:admin.settings.emailDestination.labels.password')}
							persistentLabel
							bgColorDark={theme.colorScheme.overlaysDark2}
							error={!!errors.password}
							helperText={errors.password?.message ? t(errors.password?.message) : ""}/>
					)}/>
			
			
			</Col>
			
			<Row className="w-full justify-center">
				<Button
					className="mt-4 flex items-center justify-center"
					type="submit"
					width="200px"
					height="40px"
					disabled={formHasSubmitted ? isSubmitting || !isDirty || !isValid : false}
					colorsForStates={theme.colorSchemeByState.primary}>
					<Typography variant="bold" color={theme.colorScheme.light}>
						{t('common:save')}
					</Typography>
				</Button>
			</Row>
		</form>
	)
}

export default EmailDestinationForm
