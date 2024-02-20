// import _ from "lodash"
// import apm from "elastic-apm-node"


export const register = async () => {
	// console.log({ apm })
	if(process.env.NEXT_RUNTIME === 'nodejs'){
		// console.log({ apm })
		/* if(!_.isEmpty(apm) && !apm.isStarted()){ */
		console.log('starting apm')
		await import("./apm-start.js")
		// console.log({ apm })
		// const serviceName = process.env.APP || 'next'
		// apm.start({
		// 	serviceName:                `server-${serviceName}`,
		// 	active:                     process.env.APM_IS_ACTIVE === 'true',
		// 	serverUrl:                  process.env.APM_URL || 'http://localhost:8200',
		// 	secretToken:                process.env.APM_SECRET_TOKEN || undefined,
		// 	captureBody:                'all',
		// 	usePathAsTransactionName:   true,
		// 	ignoreUrls:                 [/\/_next.*/g],
		// 	transactionIgnoreUrls:      ["/_next"],
		// 	captureHeaders:             true,
		// 	captureErrorLogStackTraces: "always",
		// 	environment:                process.env.ENVIRONMENT || 'development',
		// })
		console.log('apm started')
		// }
	}
}
