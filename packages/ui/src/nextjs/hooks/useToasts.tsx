"use client";
import { toast } from "react-toastify"
import useTranslation from "next-translate/useTranslation"
import _ from "lodash"

import { Button, Row, theme, Typography, useMain, useDimensions } from "../index"

const useToasts = () => {
	const { isTouchable } = useMain ()
	const { windowWidth } = useDimensions ()
	const { t, lang } = useTranslation ()

	const dir = lang === "he" ? "rtl" : "ltr"

	const generalError = async (errorMessagePath: string) => {
		const toastId = _.uniqueId ("error-toast-")
		return toast (() => (
			<Row className="justify-between items-center">
				<Typography className="max-[530px]:whitespace-nowrap" variant="body">
					{t (errorMessagePath)}
				</Typography>
				<Button text
				        colorsForStates={theme.colorSchemeByState.body2}
				        colorsForStatesDark={theme.colorSchemeByState.body2}
				        onClick={() => toast.dismiss (toastId)}>
					<Typography className="whitespace-nowrap"
					            variant="body">
						{t ("toasts:dismiss")}
					</Typography>
				</Button>
			</Row>
		), {
			toastId,
			position:     "bottom-left",
			type:         "error",
			rtl:          dir === "rtl",
			draggable:    isTouchable,
			pauseOnHover: true,
			closeOnClick: false,
			style:        {
				width: (windowWidth && (windowWidth > 530)) ? "fit-content" : "100%",
			},
		})
	}

	return {
		generalError
	}
}

export default useToasts
