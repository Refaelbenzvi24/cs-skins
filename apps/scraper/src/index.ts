import { Consumer } from "@acme/message-broker"
import { scrapeCsGoStash } from "./csGoStash/interval";
import { initialScrapeCsGoStash } from "./csGoStash/initial";
import { messageBrokerConnectionParams } from "./modules/vars"

export const scrape = async () => {
	await scrapeCsGoStash ()
}

export const initialScrape = async (url: string) => {
	await initialScrapeCsGoStash (url)
	await scrapeCsGoStash ([{ url }])
}

export const main = async () => {
	const consumer = new Consumer ("scraper")
	await consumer.initializeConsumer (messageBrokerConnectionParams)

	await Consumer.channel.prefetch (1)

	await consumer.consumeMessages ((message, content) => {
		if (content.payload === "initial_scrape") {
			void initialScrape (content.url)
			Consumer.channel.ack (message)
		}

		if (content.payload === "interval_scrape") {
			void scrape ()
			Consumer.channel.ack (message)
		}
	}, {})
}

console.info ("server has started and is waiting for messages!");
void (async () => await main ()) ()
// void (async () => await scrapeCsGoStash())()

