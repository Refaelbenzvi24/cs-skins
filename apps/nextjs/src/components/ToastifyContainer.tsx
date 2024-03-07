"use client";
import { ToastContainer } from 'react-toastify'

import { useTheme } from "@acme/ui";


const ToastifyContainer = () => {
	const { theme } = useTheme()

	return (
		<ToastContainer theme={theme}
		                closeButton={false}
		                limit={3}/>
	)
}

export default ToastifyContainer
