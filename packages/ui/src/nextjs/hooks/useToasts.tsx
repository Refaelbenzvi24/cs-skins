"use client";
import { toast } from "react-toastify"
import _ from "lodash"

import { Button, Row, Typography, useMain, useDimensions } from "../index"


const useToasts = () => {
	const { isTouchable, t, dir } = useMain()
	const { windowWidth }         = useDimensions()

	const generalError = (errorMessagePath: string) => {
		const toastId = _.uniqueId("error-toast-")
		return toast(() => (
			<Row className="justify-between items-center">
				<Typography className="max-[530px]:whitespace-nowrap" variant="body">
					{t(errorMessagePath)}
				</Typography>
				<Button text
				        colorsForStates="body2"
				        colorsForStatesDark="body2"
				        onClick={() => toast.dismiss(toastId)}>
					<Typography className="whitespace-nowrap"
					            variant="body">
						{t("toasts:dismiss")}
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

	const generalSuccess = (errorMessagePath: string) => {
		const toastId = _.uniqueId("success-toast-")
		return toast(() => (
			<Row className="justify-between items-center">
				<Typography className="max-[530px]:whitespace-nowrap" variant="body">
					{t(errorMessagePath)}
				</Typography>
				<Button text
				        colorsForStates="body2"
				        colorsForStatesDark="body2"
				        onClick={() => toast.dismiss(toastId)}>
					<Typography className="whitespace-nowrap"
					            variant="body">
						{t("toasts:dismiss")}
					</Typography>
				</Button>
			</Row>
		), {
			toastId,
			position:     "bottom-left",
			type:         "success",
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
		generalError,
		generalSuccess
	}
}

export default useToasts
