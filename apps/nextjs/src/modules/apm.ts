import { getPathname } from "~/utils/serverFunctions"
import _ from "lodash"


export const getApmAndStart = async () => {
	const apm = (await import("elastic-apm-node"))
	if(!_.isEmpty(apm) && !apm.isStarted()){
		const serviceName = process.env.APP || 'next'
		apm.start({
			serviceName:                `server-${serviceName}`,
			active:                     process.env.APM_IS_ACTIVE === 'true',
			serverUrl:                  process.env.APM_URL || 'http://localhost:8200',
			secretToken:                process.env.APM_SECRET_TOKEN || undefined,
			captureBody:                'all',
			usePathAsTransactionName:   true,
			ignoreUrls:                 [/\/_next.*/g],
			transactionIgnoreUrls:      ["/_next"],
			captureHeaders:             true,
			captureErrorLogStackTraces: "always",
			environment:                process.env.ENVIRONMENT || 'development',
		})
	}
	return apm
}

export const startApmTransaction = async ({ transactionName, type = 'server' }: { transactionName?: string, type?: string } = {}) => {
	const apm = await getApmAndStart()
	// console.log({ apm })
	const pathname    = transactionName ?? getPathname()
	const transaction = apm.startTransaction(pathname, type)
	// console.log({ currentTransaction: transaction })
	return transaction
}
