"use client";
import React, { useState } from "react";
import { Button, Card, Col, List, ListItem, Modal, Row, Tooltip, Typography } from "@acme/ui";
import IconCarbonLeft from "~icons/carbon/arrowLeft"
import IconCarbonRight from "~icons/carbon/arrowRight"
import EmailSettings from "~/components/Admin/Settings/EmailSettings";
import { useTranslation } from "~/app/i18n/client"
import i18next from "i18next"


interface SettingsProps {
	onBackButtonClick?: () => void
}

const Settings = ({ onBackButtonClick }: SettingsProps) => {
	const [isEmailSettingsModalOpen, setIsEmailSettingsModalOpen] = useState<boolean>(false)

	const { t, i18n } = useTranslation(i18next.language, 'settings')
	const dir         = i18n.language === 'he' ? 'rtl' : 'ltr'

	const openEmailSettings = () => setIsEmailSettingsModalOpen(true)

	return (
		<>
			<Modal
				className="my-10"
				height={'100%'}
				width={'500px'}
				animation={'none'}
				isOpen={isEmailSettingsModalOpen}
				centered
				removeBackdropBackground
				onBackdropClick={() => setIsEmailSettingsModalOpen(false)}>
				<EmailSettings onBackButtonClick={() => setIsEmailSettingsModalOpen(false)}/>
			</Modal>

			<Col className="h-full w-full">
				<Card
					className="flex flex-row py-3 px-3 mb-8 items-center"
					initial={{}}
					animate={{}}
					exit={{}}
					noShadow
					backgroundColor={'colorScheme.primary'}
					backgroundColorDark={'colorScheme.primary'}>
					<Tooltip tooltip={t('common:back')}
					         color={'colorScheme.overlaysDark'}
					         placement="bottom-center">
						<Button
							text
							noPadding
							size={'22px'}
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
							variant={'subtitle'}>
							{t('settings:admin.title')}
						</Typography>
					</Row>
				</Card>

				<List>
					<ListItem
						autoFocus
						clickable
						onClick={openEmailSettings}>
						{t('settings:admin.sections.email')}
					</ListItem>
				</List>
			</Col>
		</>
	)
}

export default Settings
