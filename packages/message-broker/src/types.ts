export type QueueNames = "scraper"

export type MessageBrokerPayloads = InitialScrapePayload | intervalScrapePayload

interface InitialScrapePayload {
	payload: "initial_scrape",
	url: string
}

interface intervalScrapePayload  {
	payload: "interval_scrape"
}
