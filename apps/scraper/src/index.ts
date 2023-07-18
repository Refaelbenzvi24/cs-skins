import {Consumer} from "@acme/message-broker"
import {scrapeCsGoStash} from "./csGoStash/interval";
import {initialScrapeCsGoStash} from "./csGoStash/initial";

export const scrape = async () => {
	await scrapeCsGoStash()
}

export const initialScrape = async (url: string) => {
	await initialScrapeCsGoStash(url)
	await scrapeCsGoStash([{url}])
}

export const main = async () => {
	const consumer = new Consumer("scraper")
	await consumer.initializeConsumer()
	
	await Consumer.channel.prefetch(1)
	
	await consumer.consumeMessages(async (message) => {
		
		const messageObject: Record<string, any> = JSON.parse(message.content.toString())
		
		if (messageObject.payload === "initial_scrape") {
			await initialScrape(messageObject.url)
			Consumer.channel.ack(message)
		}
		
		if (messageObject.payload === "interval_scrape") {
			await scrape()
			Consumer.channel.ack(message)
		}
	}, {})
}

console.info("server has started and is waiting for messages!");
(async () => await main())()
