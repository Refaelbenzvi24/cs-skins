import apm from "elastic-apm-node"


const serviceName = process.env.APP || 'scraper'
apm.start({
	serviceName,
	active:      process.env.APM_IS_ACTIVE === 'true',
	serverUrl:   process.env.APM_URL || 'http://localhost:8200',
	secretToken: process.env.APM_SECRET_TOKEN || undefined,
	environment: process.env.ENVIRONMENT || 'development',
})
import { Consumer, setApmInstance } from "@acme/message-broker"


setApmInstance(apm)
import { scrapeCsGoStash } from "./csGoStash/interval";
import { initialScrapeCsGoStash } from "./csGoStash/initial";
import { messageBrokerConnectionParams } from "./modules/vars"
import { logError } from "./services/logger"


export const scrape = async () => {
	await scrapeCsGoStash()
}

export const initialScrape = async (url: string) => {
	await initialScrapeCsGoStash(url)
	await scrapeCsGoStash([{ url }])
}

export const main = async () => {
	try {
		const consumer = new Consumer("scraper")
		await consumer.initializeConsumer(messageBrokerConnectionParams)

		await Consumer.channel.prefetch(1)
		await consumer.consumeMessages(async (content) => {
			try {
				if(content.payload === "initial_scrape"){
					await initialScrape(content.url)
				}

				if(content.payload === "interval_scrape"){
					await scrape()
				}
			} catch (error) {
				await logError(error)
			}
		})
	} catch (error) {
		await logError(error)
	}
}

console.info("server has started and is waiting for messages!");
void (async () => await main())()
// void (async () => await scrapeCsGoStash())()

