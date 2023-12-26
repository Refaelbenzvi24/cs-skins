import { toast } from "react-toastify"

import { Button, Row, theme, Typography, useMain, useDimensions, useToasts as libUseToasts } from "@acme/ui"
import { useTranslation } from "~/app/i18n/client"


export const useToasts = () => {
	const { isTouchable }  = useMain()
	const { windowWidth }  = useDimensions()
	const { t, i18n }      = useTranslation()
	const { generalError, generalSuccess } = libUseToasts()

	const dir = i18n.language === 'he' ? 'rtl' : 'ltr'

	const sendEmail = async (callback: Promise<() => void>) => {
		return await toast.promise(callback, {
			pending: {
				render: () => (
					<Row className="justify-between items-center">
						<Typography className="max-[410px]:whitespace-nowrap" variant="body">
							{t('toasts:sending')}
						</Typography>
					</Row>
				),
			},
			success: {
				render: () => (
					<Row className="justify-between items-center">
						<Typography className="max-[430px]:whitespace-nowrap"
						            variant="body">
							{t('toasts:sent')}
						</Typography>
						<Button text
						        colorsForStates={theme.colorSchemeByState.body2}
						        colorsForStatesDark={theme.colorSchemeByState.body2}
						        onClick={() => toast.dismiss('email-toast')}>
							<Typography className="whitespace-nowrap"
							            variant="body">
								{t('toasts:dismiss')}
							</Typography>
						</Button>
					</Row>
				),
			},
			error:   {
				render: () => (
					<Row className="justify-between items-center">
						<Typography className="max-[530px]:whitespace-nowrap" variant="body">
							{t('toast:sendingError')}
						</Typography>
						<Button text
						        colorsForStates={theme.colorSchemeByState.body2}
						        colorsForStatesDark={theme.colorSchemeByState.body2}
						        onClick={() => toast.dismiss('email-toast')}>
							<Typography className="whitespace-nowrap"
							            variant="body">
								{t('toasts:dismiss')}
							</Typography>
						</Button>
					</Row>
				),
			},
		}, {
			toastId:      'email-toast',
			position:     "bottom-left",
			rtl:          dir === 'rtl',
			draggable:    isTouchable,
			pauseOnHover: true,
			closeOnClick: false,
			style:        {
				width: (windowWidth && (windowWidth > 530)) ? 'fit-content' : '100%',
			},
		})
	}

	// const reloadPrompt = (offlineReady: boolean, needRefresh: boolean, updateServiceWorker: (value: boolean) => Promise<void>, close: () => void) => {
	// 	return toast.info(() => (
	// 		<Row className="justify-between items-center">
	// 			{offlineReady
	// 				? (
	// 					<Typography variant="body">
	// 						{t('reloadPrompt.offlineReady')}
	// 					</Typography>
	// 				)
	// 				: <Typography variant="body">{t('reloadPrompt.newContent')}</Typography>
	// 			}
	//
	// 			{needRefresh ? (
	// 				<Button
	// 					text
	// 					colorsForStates={isDarkMode ? theme.colorSchemeByState.accent : theme.colorSchemeByState.body2}
	// 					onClick={() => toast.dismiss('reload-prompt-toast')}>
	// 					{t('reloadPrompt.reload')}
	// 				</Button>
	// 			) : null}
	// 			<Button
	// 				text
	// 				colorsForStates={isDarkMode ? theme.colorSchemeByState.accent : theme.colorSchemeByState.body2}
	// 				onClick={() => toast.dismiss('reload-prompt-toast')}>
	// 				{t('reloadPrompt.close')}
	// 			</Button>
	// 		</Row>
	// 	), {
	// 		onClose:      () => {
	// 			needRefresh ? updateServiceWorker(false) : close()
	// 		},
	// 		toastId:      'reload-prompt-toast',
	// 		position:     "bottom-left",
	// 		rtl:          i18n.dir() === 'rtl',
	// 		draggable:    isTouchable,
	// 		pauseOnHover: true,
	// 		closeOnClick: false,
	// 		style:        {
	// 			width: windowWidth > 530 ? 'fit-content' : '100%',
	// 		},
	// 	})
	// }


	return {
		sendEmail,
		generalError,
		generalSuccess
	}
}
