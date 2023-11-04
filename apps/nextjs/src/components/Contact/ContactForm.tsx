import useToasts from "../../hooks/useToasts"
import {Button, Col, Row, TextArea, TextField, theme, Typography, useDimensions} from "@acme/ui"
import {type SubmitHandler, Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod"
import {z} from "zod"
import {leadsValidations} from "@acme/validations"
import {useEffect, useRef, useState} from "react";
import useTranslation from "next-translate/useTranslation"
import {api} from "~/utils/api";
import {mergeRefs} from "react-merge-refs";


const contactValidation = z.object(leadsValidations.contactObject)

type ContactValidationSchema = z.infer<typeof contactValidation>

const ContactForm = () => {
	const submitFormMutation = api.leads.create.useMutation()
	const toasts = useToasts()
	const {windowWidth} = useDimensions()
	const {t} = useTranslation()

	const firstInputRef = useRef<HTMLInputElement>(null)

	const [formHasSubmitted, setFormHasSubmitted] = useState(false)

	const {
		handleSubmit,
		reset,
		control,
		formState: {errors, isSubmitting, isDirty, isValid}
	} = useForm<ContactValidationSchema>({
		resolver: zodResolver(contactValidation),
		mode: "onChange",
	})

	const onSubmit: SubmitHandler<ContactValidationSchema> = async (data) => {
		await toasts.sendEmail(submitFormMutation.mutateAsync(data))
		reset({
			name: "",
			email: "",
			phone: "",
			message: ""
		})
		firstInputRef.current?.focus()
	}

	useEffect(() => {
		if (firstInputRef.current) firstInputRef.current.focus({preventScroll: true})
	}, [firstInputRef])

	return (
		<Col className="h-full overflow-hidden" id="contact">
			<Col className="justify-around h-full">
				<form onSubmit={(event) => {
					if (!formHasSubmitted) setFormHasSubmitted(() => true)
					void handleSubmit(onSubmit)(event)
				}}>
					<Col className="space-y-1">
						<Controller
							defaultValue={""}
							name={"name"}
							control={control}
							render={({field: {ref, ...restField}}) => (
								<TextField
									{...restField}
									ref={mergeRefs([ref, firstInputRef])}
									required
									disabled={isSubmitting}
									labelProps={{hasBackground: !!windowWidth && windowWidth < 1300}}
									helperTextProps={{hasBackground: !!windowWidth && windowWidth < 1300}}
									label={t('forms:contact.labels.name')}
									error={!!errors.name}
									helperText={errors.name?.message ? t(errors.name?.message) : ""}/>
							)}/>

						<Controller
							defaultValue={""}
							name={"email"}
							control={control}
							render={({field}) => (
								<TextField
									{...field}
									required
									disabled={isSubmitting}
									labelProps={{hasBackground: !!windowWidth && windowWidth < 1300}}
									helperTextProps={{hasBackground: !!windowWidth && windowWidth < 1300}}
									label={t('forms:contact.labels.email')}
									error={!!errors.email}
									helperText={errors.email?.message ? t(errors.email?.message) : ""}/>
							)}/>


						<Controller
							defaultValue={""}
							name={"phone"}
							control={control}
							render={({field}) => (
								<TextField
									{...field}
									required
									disabled={isSubmitting}
									labelProps={{hasBackground: !!windowWidth && windowWidth < 1300}}
									helperTextProps={{hasBackground: !!windowWidth && windowWidth < 1300}}
									label={t('forms:contact.labels.phone')}
									error={!!errors.phone}
									helperText={errors.phone?.message ? t(errors.phone?.message) : ""}/>
							)}/>

						<Controller
							defaultValue={""}
							name={"message"}
							control={control}
							render={({field}) => (
								<TextArea
									{...field}
									disabled={isSubmitting}
									labelProps={{hasBackground: !!windowWidth && windowWidth < 1300}}
									helperTextProps={{hasBackground: !!windowWidth && windowWidth < 1300}}
									label={t('forms:contact.labels.message')}
									error={!!errors.message}
									helperText={errors.message?.message ? t(errors.message?.message) : ""}/>
							)}/>
					</Col>

					<Row className="w-full max-[800px]:justify-center">
						<Button
							className="flex items-center justify-center"
							type="submit"
							width="200px"
							height="40px"
							disabled={formHasSubmitted ? isSubmitting || !isDirty || !isValid : false}
							colorsForStates={theme.colorSchemeByState.primary}>
							<Typography variant="bold" color={theme.colorScheme.light}>
								{t('common:send')}
							</Typography>
						</Button>
					</Row>
				</form>
			</Col>
		</Col>
	)
}

export default ContactForm
