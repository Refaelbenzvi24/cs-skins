import apm from "elastic-apm-node"
import _ from "lodash"


export const register = () => {
	console.log(process.env)
	if(!_.isEmpty(apm) && !apm.isStarted()){
		console.log('starting apm')
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
		console.log('apm started')
	}
}
