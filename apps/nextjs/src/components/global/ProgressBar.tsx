"use client";
import NextTopLoader from "nextjs-toploader"
import { theme } from "@acme/ui"


const ProgressBar = () => {
	return (
		<NextTopLoader
			color={theme.colorScheme.primary}
			showSpinner={false}
			height={5}
			crawlSpeed={100}
		/>
	)
}

export default ProgressBar
