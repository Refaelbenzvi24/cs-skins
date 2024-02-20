const serviceName = process.env.APP || 'next'
const apm = require("elastic-apm-node")
  .start({
	  serviceName: `server-${serviceName}`,
	  active: process.env.APM_IS_ACTIVE === 'true',
	  serverUrl: process.env.APM_URL || 'http://localhost:8200',
	  secretToken: process.env.APM_SECRET_TOKEN || undefined,
	  captureBody: 'all',
	  usePathAsTransactionName: true,
	  ignoreUrls: [/\/_next.*/g],
	  transactionIgnoreUrls: ["/_next"],
	  captureHeaders: true,
	  captureErrorLogStackTraces: "always",
	  environment: process.env.ENVIRONMENT || 'development',
  })
