export type QueueNames = keyof PayloadsByQueueName

export type MessageBrokerPayloads = InitialScrapePayload | intervalScrapePayload

export interface PayloadsByQueueName {
	"scraper": InitialScrapePayload | intervalScrapePayload
}

interface InitialScrapePayload {
	payload: "initial_scrape",
	url: string
}

interface intervalScrapePayload  {
	payload: "interval_scrape"
}
