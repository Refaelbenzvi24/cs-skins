"use client";
import { Button, Card, Col, List, ListItem, Row, Tooltip, Typography } from "@acme/ui";

import IconCarbonLeft from "~icons/carbon/arrowLeft"
import IconCarbonRight from "~icons/carbon/arrowRight"
import EmailDestinationForm from "~/components/Admin/Settings/EmailSettings/EmailDestinationForm";
import React from "react";
import { useClientTranslation } from "~/app/i18n/client"
import i18next from "i18next"


interface EmailSettingsProps {
	onBackButtonClick?: () => void
}

const EmailSettings = ({ onBackButtonClick }: EmailSettingsProps) => {
	const { t, i18n } = useClientTranslation(i18next.language, 'settings')
	const dir         = i18n.language === "he" ? "rtl" : "ltr"

	return (
		<Col className="h-full w-full">
			<Card
				className="flex flex-row py-3 px-3 mb-8 items-center"
				noShadow
				backgroundColor={'colorScheme.primary'}
				backgroundColorDark={'colorScheme.primary'}>
				<Tooltip tooltip={t("common:back")}
				         color={'colorScheme.overlaysDark'}
				         placement="bottom-center">
					<Button
						text
						noPadding
						size={"22px"}
						aria-label="back"
						colorsForStates={'white'}
						colorsForStatesDark={'white'}
						onClick={onBackButtonClick}>
						{dir === "rtl" ? <IconCarbonRight/> : <IconCarbonLeft/>}
					</Button>
				</Tooltip>

				<Row className="ltr:pl-4 rtl:pr-4">
					<Typography
						color={'colorScheme.white'}
						colorDark={'colorScheme.white'}
						variant={"subtitle"}>
						{t("settings:admin.email.title")}
					</Typography>
				</Row>
			</Card>

			<List className="py-2">
				<ListItem>
					<Col className="space-y-3">
						<Typography variant={"body"}>
							{t("settings:admin.email.emailDestination.title")}
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
