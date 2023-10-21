import React, {useState} from "react";
import {Button, Card, Col, Divider, List, ListItem, Modal, Row, theme, Tooltip, Typography} from "@acme/ui";
import useTranslation from "next-translate/useTranslation";
import IconCarbonLeft from "~icons/carbon/arrowLeft"
import IconCarbonRight from "~icons/carbon/arrowRight"
import {css} from "@emotion/css";
import tw from "twin.macro"
import EmailSettings from "~/components/Admin/Settings/EmailSettings";

interface SettingsProps {
	onBackButtonClick?: () => void
}

const Settings = ({onBackButtonClick}: SettingsProps) => {
	const [isEmailSettingsModalOpen, setIsEmailSettingsModalOpen] = useState<boolean>(false)
	
	const {t, lang} = useTranslation()
	const dir = lang === 'he' ? 'rtl' : 'ltr'
	
	const openEmailSettings = () => {
		setIsEmailSettingsModalOpen(true)
	}
	
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
					bgColor={theme.colorScheme.primary}
					bgColorDark={theme.colorScheme.primary}>
					<Tooltip tooltip={t('common:back')}
					         color={theme.colorScheme.overlaysDark}
					         placement="bottom-center">
						<Button
							text
							noPadding
							size={'22px'}
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
