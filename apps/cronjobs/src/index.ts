import {CronJob} from "cron"
import {getCronIntervalString, getIntervalInSec} from "./utils/scheduling"
import {Producer} from "@acme/message-broker"


export const publishScrapingMessage = async (interval: number) => {
	console.log(`sending message for scrape with interval ${interval}...`)
	const producer = new Producer("scraper")
	await producer.initializeProducer()
	await producer.sendMessage({payload: "interval_scrape"})
}

export const initialJob = async () => {
	console.log("sending initial message...")
	const intervalInMili = getIntervalInSec({minutes: 5})
	await publishScrapingMessage(intervalInMili)
}

export const cronJobsInitializer = () => {
	const intervalInMili = getIntervalInSec({minutes: 5})
	const cronInterval = getCronIntervalString({minutes: 5})
	
	const job = new CronJob(cronInterval, () => {
		console.log("sending intervaled message...");
		
		(async () => await publishScrapingMessage(intervalInMili))()
	})
	
	job.start()
}

export const serviceInitializer = () => {
	(async () => await initialJob())()
	cronJobsInitializer()
}

serviceInitializer()
