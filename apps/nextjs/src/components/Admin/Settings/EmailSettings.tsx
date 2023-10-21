import { Button, Card, Col, Divider, List, ListItem, Row, TextField, theme, Tooltip, Typography } from "@acme/ui";
import useTranslation from "next-translate/useTranslation";
import IconCarbonLeft from "~icons/carbon/arrowLeft"
import IconCarbonRight from "~icons/carbon/arrowRight"
import { css } from "@emotion/css";
import tw from "twin.macro"
import EmailDestinationForm from "~/components/Admin/Settings/EmailSettings/EmailDestinationForm";
import React from "react";

interface EmailSettingsProps {
	onBackButtonClick?: () => void
}

const EmailSettings = ({ onBackButtonClick }: EmailSettingsProps) => {
	const { t, lang } = useTranslation ()
	const dir = lang === "he" ? "rtl" : "ltr"

	return (
		<Col className="h-full w-full">
			<Card
				className="flex flex-row py-3 px-3 mb-8 items-center"
				noShadow
				bgColor={theme.colorScheme.primary}
				bgColorDark={theme.colorScheme.primary}>
				<Tooltip tooltip={t ("common:back")}
				         color={theme.colorScheme.overlaysDark}
				         placement="bottom-center">
					<Button
						text
						noPadding
						size={"22px"}
						aria-label="back"
						colorsForStates={theme.colorSchemeByState.white}
						colorsForStatesDark={theme.colorSchemeByState.white}
						onClick={onBackButtonClick}>
						{dir === "rtl" ? <IconCarbonRight/> : <IconCarbonLeft/>}
					</Button>
				</Tooltip>

				<Row className="ltr:pl-4 rtl:pr-4">
					<Typography
						color={theme.colorScheme.white}
						darkColor={theme.colorScheme.white}
						variant={"subtitle"}>
						{t ("settings:admin.email.title")}
					</Typography>
				</Row>
			</Card>

			<List className="py-2">
				<ListItem>
					<Col className="space-y-3">
						<Typography variant={"body"}>
							{t ("settings:admin.email.emailDestination.title")}
						</Typography>

						<List>
							<ListItem nested>
								<EmailDestinationForm/>
							</ListItem>
						</List>
					</Col>
				</ListItem>
			</List>
		</Col>
	)
}

export default EmailSettings
