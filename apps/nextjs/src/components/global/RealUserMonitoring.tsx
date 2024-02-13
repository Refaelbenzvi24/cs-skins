"use client";
import { useEffect } from "react"
import { initRum } from "~/utils/monitoring/elastic/rum"
import { useApm } from "~/components/ApmProvider"
import { apm } from "@elastic/apm-rum"
import { usePathname } from "next/navigation"


const RealUserMonitoring = () => {
	const pathname = usePathname()
	const { traceId, transactionId } = useApm()

	useEffect(() => {
		initRum()
		const currentTransaction = apm.getCurrentTransaction()
		apm.setInitialPageLoadName(pathname)
		if(currentTransaction && 'traceId' in currentTransaction) currentTransaction.traceId = traceId ?? currentTransaction.traceId
		if(currentTransaction && 'id' in currentTransaction) currentTransaction.id = transactionId ?? currentTransaction.id
	}, [])

	useEffect(() => {
		const currentTransaction = apm.getCurrentTransaction()
		if(currentTransaction) currentTransaction.name = pathname
	}, [pathname])

	return null
}

export default RealUserMonitoring
