import BaseError from "@acme/logger/src/Errors/BaseError"
import TRPCError from "@acme/logger/src/Errors/TRPCError"


export type QueueNames = keyof PayloadsByQueueName

export type MessageBrokerPayloads = InitialScrapePayload | intervalScrapePayload

export interface PayloadsByQueueName {
	"scraper": InitialScrapePayload | intervalScrapePayload
	"logs": LogPayload
}

interface InitialScrapePayload {
	payload: "initial_scrape",
	url: string
}

interface intervalScrapePayload  {
	payload: "interval_scrape"
}

interface LogPayload {
	error: string
}
