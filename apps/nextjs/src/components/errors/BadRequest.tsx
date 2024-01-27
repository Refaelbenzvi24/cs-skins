"use client";
import type { ErrorComponentProps } from "~/components/errors/index"
import { ATagButton, Button, Col, LinkButton, Row, Typography, useMain } from "@acme/ui"
import { useTranslation } from "~/app/i18n/client"
import Error400Illustration from "~/assets/error_400_illustration.svg"
import ErrorInfo from "~/components/errors/ErrorInfo"


const BadRequest = ({ message, ...error }: ErrorComponentProps) => {
	const { language } = useMain()
	const { t }        = useTranslation(language, ['errors'])

	return (
		<Col className="w-full h-full">
			<div className="flex flex-col xl:flex-row my-auto items-center xl:px-20 px-8 mx-auto">
				<Col className="w-full justify-center items-center xl:max-h-none max-h-[550px] xl:min-w-[520px]">
					<Error400Illustration/>
				</Col>
				<Col className="py-10 mx-auto xl:px-10 w-full justify-center">
					<Typography className="!text-5xl xs:!text-5xl sm:!text-5xl md:!text-6xl lg:!text-7xl xl:!text-8xl"
					            variant="h1" size={6} color="colorScheme.success">
						{t('errors:400.title')}
					</Typography>
					<Col className="pt-6">
						<Typography className="!text-[1rem] xs:!text-[1rem] sm:!text-[1rem] md:!text-[1rem] lg:!text-[1.1rem] xl:!text-[1.2rem]"
						            variant="body" size={1.2}>
							{t(message)}
						</Typography>
					</Col>
					<Col className="pt-2">
						<Typography className="!text-[1rem] xs:!text-[1rem] sm:!text-[1rem] md:!text-[1rem] lg:!text-[1.1rem] xl:!text-[1.2rem]"
						            variant="body" size={1.2}>
							{t('errors:400.subtitle')}
						</Typography>
						<Typography className="!text-[1rem] xs:!text-[1rem] sm:!text-[1rem] md:!text-[1rem] lg:!text-[1.1rem] xl:!text-[1.2rem]"
						            variant="body" size={1.2}>
							{t("errors:400.subtitle2")}
						</Typography>
					</Col>

					<ErrorInfo errorId={error.errorId} timestamp={error.timestamp} errorCode={error.errorCode}/>

					<Row className="pt-6">
						<LinkButton href="/">
							<Typography variant="body" color="colorScheme.light">
								{t('errors:400.homepage')}
							</Typography>
						</LinkButton>
					</Row>
				</Col>
			</div>
			<Row className="justify-end px-4 pb-3">
				<Typography variant="small" color="colorScheme.subtitle1" as="span">
					<ATagButton
						href="https://www.freepik.com/free-vector/400-error-bad-request-concept-illustration_7906235.htm#query=400&position=4&from_view=search&track=sph&uuid=1cf54804-9717-40bf-8254-5254dd06bfa5"
						text noPadding colorsForStates="subtitle1">
						Image by storyset
					</ATagButton> on Freepik
				</Typography>
			</Row>
		</Col>
	);
}

export default BadRequest
