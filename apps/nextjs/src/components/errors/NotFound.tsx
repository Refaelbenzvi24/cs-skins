"use client";
import type { ErrorComponentProps } from "~/components/errors/index"
import { ATagButton, Col, LinkButton, Row, Typography, useMain } from "@acme/ui"
import Error404Illustration from "../../assets/error_404_illustration.svg"
import { useTranslation } from "~/app/i18n/client"
import ErrorInfo from "~/components/errors/ErrorInfo"


const NotFound = ({ message, ...error }: ErrorComponentProps) => {
	const { language } = useMain()
	const { t }        = useTranslation(language, ['errors'])

	return (
		<Col className="w-full h-full">
			<div className="flex flex-col xl:flex-row my-auto items-center xl:px-20 px-8 mx-auto">
				<Col className="w-full justify-center items-center xl:max-h-none max-h-[550px] xl:min-w-[520px]">
					<Error404Illustration/>
				</Col>
				<Col className="py-10 mx-auto xl:px-10 w-full justify-center">
					<Typography className="!text-5xl xs:!text-5xl sm:!text-5xl md:!text-6xl lg:!text-7xl xl:!text-8xl"
					            variant="h1" size={6} color="colorScheme.error">
						{t('errors:404.title')}
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
							{t('errors:404.subtitle')}
						</Typography>
						<Typography className="!text-[1rem] xs:!text-[1rem] sm:!text-[1rem] md:!text-[1rem] lg:!text-[1.1rem] xl:!text-[1.2rem]"
						            variant="body" size={1.2}>
							{t("errors:404.subtitle2")}
						</Typography>
					</Col>
					<ErrorInfo errorId={error.errorId} timestamp={error.timestamp} errorCode={error.errorCode}/>

					<Row className="pt-6 space-x-2">
						<LinkButton href="/">
							<Typography variant="body" color="colorScheme.light">
								{t('errors:404.homepage')}
							</Typography>
						</LinkButton>
					</Row>
				</Col>
			</div>
			<Row className="justify-end px-4 pb-3">
				<Typography variant="small" color="colorScheme.subtitle1" as="span">
					<ATagButton
						href="https://www.freepik.com/free-vector/error-404-concept-illustration_7741849.htm#query=404&position=2&from_view=search&track=sph&uuid=e161fe4f-3bf4-4d28-b340-d9962d8446b2#position=2&query=404"
						text noPadding colorsForStates="subtitle1">
						Image by storyset
					</ATagButton> on Freepik
				</Typography>
			</Row>
		</Col>
	);
}

export default NotFound;
