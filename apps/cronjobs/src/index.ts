import apm from "elastic-apm-node"


const serviceName = process.env.APP || 'cronjobs'
apm.start({
	serviceName,
	active:      process.env.APM_IS_ACTIVE === 'true',
	serverUrl:   process.env.APM_URL || 'http://localhost:8200',
	secretToken: process.env.APM_SECRET_TOKEN || undefined,
	environment: process.env.ENVIRONMENT || 'development',
})
import { Producer, setApmInstance } from '@acme/message-broker'


setApmInstance(apm)
import { CronJob } from 'cron'
import { getCronIntervalString, getIntervalInMilliseconds } from "./scheduling/scheduling"
import { messageBrokerConnectionParams } from "./vars"
import { errorLogger } from "./services/logger"


export const publishScrapingMessage = async (interval: number) => {
	const producer = new Producer("scraper")
	const queue    = await producer.initializeProducer(messageBrokerConnectionParams)
	if(queue.messageCount !== 0) await producer.purgeQueue()
	await producer.sendMessage({ payload: "interval_scrape" }, { expiration: interval });
};

export const initialJob = async () => {
	const intervalInMili = getIntervalInMilliseconds({ minutes: 5 })
	await publishScrapingMessage(intervalInMili)
};

export const cronJobsInitializer = () => {
	const intervalInMili = getIntervalInMilliseconds({ minutes: 5 })
	const cronInterval   = getCronIntervalString({ minutes: 5 })

	const job = new CronJob(cronInterval, () => {
		void publishScrapingMessage(intervalInMili)
	})
	job.start()
}

export const serviceInitializer = async () => {
	try {
		void initialJob()
		cronJobsInitializer()
	} catch (error) {
		await errorLogger.logError(error)
	}
}

void serviceInitializer()
