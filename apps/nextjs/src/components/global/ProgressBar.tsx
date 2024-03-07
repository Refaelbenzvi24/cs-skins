"use client";
import NextTopLoader from "nextjs-toploader"
import { theme } from "@acme/ui"
import { useEffect } from "react"
import { useSearchParams, usePathname } from "next/navigation"
import * as NProgress from "nprogress"


const ProgressBar = () => {
	const searchParams = useSearchParams()
	const pathname     = usePathname()
	useEffect(() => {
		return () => {
			NProgress.done()
		}
	}, [searchParams, pathname])

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
